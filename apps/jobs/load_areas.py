"""Load Java kecamatan boundaries from BIG into the `area` table.

Run: uv run --env-file ../web/.env load_areas.py
"""

import json
import os
import sys
import urllib.parse
import urllib.request
from collections import Counter
from dataclasses import dataclass

import psycopg

LAYER_URL = (
    "https://geoservices.big.go.id/rbi/rest/services/"
    "BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer/0"
)
JAVA_PROVINCE_CODES = ["31", "32", "33", "34", "35", "36"]
FEATURES_PER_REQUEST = 50


@dataclass(frozen=True)
class Area:
    code: str
    name: str
    district_code: str
    district_name: str
    province_code: str
    province_name: str
    boundary_release: str
    boundary_geojson: str


def query_layer(params: dict[str, str]) -> dict:
    url = f"{LAYER_URL}/query?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=120) as response:
        body = json.load(response)
    if "error" in body:
        raise RuntimeError(f"BIG query failed: {body['error']}")
    return body


def fetch_object_ids() -> list[int]:
    provinces = ",".join(f"'{code}'" for code in JAVA_PROVINCE_CODES)
    body = query_layer(
        {
            "where": f"KDPPUM IN ({provinces}) AND KDCPUM IS NOT NULL AND KDCPUM <> ''",
            "returnIdsOnly": "true",
            "f": "json",
        }
    )
    if not body.get("objectIds"):
        raise RuntimeError("BIG returned no object ids for the Java filter")
    return sorted(body["objectIds"])


def read_text(attributes: dict, field: str) -> str:
    value = attributes.get(field)
    if value is None:
        raise RuntimeError(f"BIG feature has no {field}: {attributes}")
    return value.strip()


def parse_area(feature: dict) -> Area:
    attributes = feature["properties"]
    return Area(
        code=read_text(attributes, "KDCPUM"),
        name=read_text(attributes, "WADMKC"),
        district_code=read_text(attributes, "KDPKAB"),
        district_name=read_text(attributes, "WADMKK"),
        province_code=read_text(attributes, "KDPPUM"),
        province_name=read_text(attributes, "WADMPR"),
        boundary_release=read_text(attributes, "METADATA"),
        boundary_geojson=json.dumps(feature["geometry"]),
    )


def fetch_areas(object_ids: list[int]) -> list[Area]:
    areas = []
    for start in range(0, len(object_ids), FEATURES_PER_REQUEST):
        batch = object_ids[start : start + FEATURES_PER_REQUEST]
        body = query_layer(
            {
                "objectIds": ",".join(str(object_id) for object_id in batch),
                "outFields": "KDCPUM,WADMKC,KDPKAB,WADMKK,KDPPUM,WADMPR,METADATA",
                "outSR": "4326",
                "f": "geojson",
            }
        )
        areas.extend(parse_area(feature) for feature in body["features"])
        print(f"fetched {len(areas)}/{len(object_ids)} areas", file=sys.stderr)
    return areas


def check_areas(areas: list[Area], expected_count: int) -> None:
    if len(areas) != expected_count:
        raise RuntimeError(
            f"BIG returned {len(areas)} features, expected {expected_count}"
        )
    repeated_codes = [
        code
        for code, count in Counter(a.code for a in areas).items()
        if count > 1
    ]
    if repeated_codes:
        raise RuntimeError(
            f"Codes with more than one polygon: {repeated_codes[:10]}"
        )
    releases = {area.boundary_release for area in areas}
    if len(releases) != 1:
        raise RuntimeError(
            f"Expected one boundary release, got {sorted(releases)}"
        )


UPSERT_AREA = """
with shape as (
  select st_multi(st_collectionextract(st_makevalid(st_force2d(
    st_setsrid(st_geomfromgeojson(%(boundary_geojson)s), 4326))), 3)) as boundary
)
insert into area (code, name, district_code, district_name, province_code, province_name,
                  boundary_release, boundary, display_boundary, center)
select %(code)s, %(name)s, %(district_code)s, %(district_name)s, %(province_code)s,
       %(province_name)s, %(boundary_release)s, boundary, boundary, st_pointonsurface(boundary)
from shape
on conflict (code) do update set
  name = excluded.name,
  district_code = excluded.district_code,
  district_name = excluded.district_name,
  province_code = excluded.province_code,
  province_name = excluded.province_name,
  boundary_release = excluded.boundary_release,
  boundary = excluded.boundary,
  center = excluded.center
"""


# The upsert stores the full boundary as a placeholder, because display_boundary is not null.
UPDATE_DISPLAY_BOUNDARIES = """
update area set display_boundary = simplified.boundary
from (
  select code, st_multi(st_coveragesimplify(boundary, 0.005) over ()) as boundary from area
) simplified
where area.code = simplified.code
"""


def save_areas(connection: psycopg.Connection, areas: list[Area]) -> None:
    with connection.transaction(), connection.cursor() as cursor:
        cursor.executemany(UPSERT_AREA, [area.__dict__ for area in areas])
        cursor.execute(UPDATE_DISPLAY_BOUNDARIES)


def report(connection: psycopg.Connection, areas: list[Area]) -> None:
    release = areas[0].boundary_release
    rows = connection.execute(
        """
        select province_code, province_name, count(*),
               count(*) filter (where not st_isvalid(boundary)),
               count(*) filter (where not st_contains(boundary, center))
        from area where boundary_release = %s
        group by province_code, province_name order by province_code
        """,
        [release],
    ).fetchall()
    for code, name, count, invalid, center_outside in rows:
        print(
            f"{code} {name}: {count} areas, {invalid} invalid, {center_outside} centers outside"
        )

    loaded_codes = {area.code for area in areas}
    stale = connection.execute(
        "select code from area where boundary_release <> %s or not (code = any(%s))",
        [release, list(loaded_codes)],
    ).fetchall()
    if stale:
        # ponytail: stale rows are reported, not deleted; deleting cascades to NASA rows.
        print(f"{len(stale)} areas in the table are not in release {release}")
    print(f"release {release}: {sum(row[2] for row in rows)} areas loaded")


def main() -> None:
    object_ids = fetch_object_ids()
    areas = fetch_areas(object_ids)
    check_areas(areas, expected_count=len(object_ids))
    with psycopg.connect(os.environ["DATABASE_URL"]) as connection:
        save_areas(connection, areas)
        report(connection, areas)


if __name__ == "__main__":
    main()
