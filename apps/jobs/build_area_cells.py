"""Fill `area_cell` with the NASA grid cells that cover each area, and each cell's share.

Run after load_areas.py: uv run --env-file ../web/.env build_area_cells.py
"""

import os
from dataclasses import dataclass

import psycopg

EASE2_9KM_CELL_METERS = 9008.055210146
EASE2_9KM_ROWS = 1624
EASE2_9KM_COLUMNS = 3856


@dataclass(frozen=True)
class Grid:
    source: str
    srid: int
    origin_x: float
    origin_y: float
    cell_width: float
    cell_height: float
    cell_id_sql: str


LON_LAT_CELL_ID = "trim_scale(round(center_x::numeric, 4)) || ',' || trim_scale(round(center_y::numeric, 4))"

GRIDS = [
    # IMERG: 0.1 degree cells with edges on multiples of 0.1.
    Grid("imerg_late", 4326, -180, -90, 0.1, 0.1, LON_LAT_CELL_ID),
    Grid("imerg_final", 4326, -180, -90, 0.1, 0.1, LON_LAT_CELL_ID),
    # POWER meteorology uses the MERRA-2 grid, whose cell centers sit on -180 and -90.
    Grid("power", 4326, -180.3125, -90.25, 0.625, 0.5, LON_LAT_CELL_ID),
    # SMAP L4: EASE-Grid 2.0 global 9 km. Rows count down from the top edge, as in the SMAP files.
    Grid(
        "smap_l4",
        6933,
        -EASE2_9KM_COLUMNS / 2 * EASE2_9KM_CELL_METERS,
        -EASE2_9KM_ROWS / 2 * EASE2_9KM_CELL_METERS,
        EASE2_9KM_CELL_METERS,
        EASE2_9KM_CELL_METERS,
        f"({EASE2_9KM_ROWS - 1} - j) || ',' || i",
    ),
]


def insert_cells_sql(grid: Grid) -> str:
    return f"""
    insert into area_cell (area_code, source, cell_id, cell_center, area_share)
    select code, %(source)s, {grid.cell_id_sql}, st_transform(st_setsrid(st_point(center_x, center_y), %(srid)s), 4326),
           st_area(st_intersection(boundary, cell_in_4326)::geography) / st_area(boundary::geography)
    from (
      select a.code, a.boundary, c.i, c.j,
             %(origin_x)s + (c.i + 0.5) * %(cell_width)s as center_x,
             %(origin_y)s + (c.j + 0.5) * %(cell_height)s as center_y,
             st_transform(c.cell, 4326) as cell_in_4326
      from area a
      cross join lateral (
        select st_transform(a.boundary, %(srid)s) as native_boundary
      ) native
      cross join lateral (
        select i, j, st_makeenvelope(
                 %(origin_x)s + i * %(cell_width)s, %(origin_y)s + j * %(cell_height)s,
                 %(origin_x)s + (i + 1) * %(cell_width)s, %(origin_y)s + (j + 1) * %(cell_height)s,
                 %(srid)s) as cell
        from generate_series(
               floor((st_xmin(native.native_boundary) - %(origin_x)s) / %(cell_width)s)::int,
               floor((st_xmax(native.native_boundary) - %(origin_x)s) / %(cell_width)s)::int) i,
             generate_series(
               floor((st_ymin(native.native_boundary) - %(origin_y)s) / %(cell_height)s)::int,
               floor((st_ymax(native.native_boundary) - %(origin_y)s) / %(cell_height)s)::int) j
      ) c
    ) candidate
    where st_intersects(boundary, cell_in_4326)
    """


def rebuild_grid(connection: psycopg.Connection, grid: Grid) -> None:
    with connection.transaction():
        connection.execute("delete from area_cell where source = %s", [grid.source])
        connection.execute(insert_cells_sql(grid), grid.__dict__)


def report(connection: psycopg.Connection) -> None:
    rows = connection.execute(
        """
        with per_area as (
          select source, area_code, sum(area_share) as total_share, count(*) as cells
          from area_cell group by source, area_code
        ), shared as (
          select source, count(*) as shared_cells
          from (select source, cell_id from area_cell group by source, cell_id having count(*) > 1) s
          group by source
        )
        select p.source, count(*), round(avg(p.cells), 2), round(min(p.total_share)::numeric, 4),
               round(max(p.total_share)::numeric, 4), coalesce(max(s.shared_cells), 0)
        from per_area p left join shared s using (source)
        group by p.source order by p.source
        """
    ).fetchall()
    area_count = connection.execute("select count(*) from area").fetchone()[0]
    for source, areas, average_cells, min_share, max_share, shared_cells in rows:
        print(
            f"{source}: {areas}/{area_count} areas, {average_cells} cells per area, "
            f"share sum {min_share} to {max_share}, {shared_cells} cells shared by several areas"
        )


def main() -> None:
    with psycopg.connect(os.environ["DATABASE_URL"]) as connection:
        for grid in GRIDS:
            rebuild_grid(connection, grid)
            print(f"built {grid.source}")
        report(connection)


if __name__ == "__main__":
    main()
