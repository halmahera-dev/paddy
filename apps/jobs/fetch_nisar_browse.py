"""Download NISAR GUNW browse interferograms over Jakarta and export them for the web app.

The browse PNGs are public. The full HDF5 products need an Earthdata login, so this job
stays on the browse layer until we process real displacement values.
"""

import io
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

JAKARTA = "POINT(106.82 -6.12)"
ASCENDING_TRACK = 10
NORTH_JAKARTA_LAND = (106.70, -6.20, 106.98, -6.10)
NODATA_RGB = np.array([49, 18, 59])
# ponytail: tuned by eye on sea vs land in the browse colormap; replace with HDF5 coherence.
ROUGHNESS_LIMIT = 60
WEB_APP = Path(__file__).resolve().parents[1] / "web"
IMAGE_DIR = WEB_APP / "public" / "nisar"
CATALOG_PATH = WEB_APP / "src" / "features" / "nisar" / "nisar-pairs.json"


def search_gunw_granules():
    query = urllib.parse.urlencode(
        {
            "dataset": "NISAR",
            "processingLevel": "GUNW",
            "intersectsWith": JAKARTA,
            "output": "geojson",
            "maxResults": 500,
        }
    )
    url = f"https://api.daac.asf.alaska.edu/services/search/param?{query}"
    with urllib.request.urlopen(url, timeout=120) as response:
        features = json.load(response)["features"]
    track_features = [f for f in features if f["properties"]["pathNumber"] == ASCENDING_TRACK]
    return sorted(track_features, key=lambda f: f["properties"]["startTime"])


def download_image(url):
    with urllib.request.urlopen(url, timeout=300) as response:
        return Image.open(io.BytesIO(response.read())).convert("RGBA")


def fit_pixel_to_lonlat(pixels, lonlats):
    design = np.column_stack([pixels, np.ones(len(pixels))])
    transform, *_ = np.linalg.lstsq(design, lonlats, rcond=None)
    residual_degrees = np.abs(design @ transform - lonlats).max()
    return transform, residual_degrees


def georeference(rgba, footprint):
    """Match the four extreme corners of the valid data to the footprint polygon corners."""
    is_drawn = rgba[:, :, 3] > 0
    is_nodata = np.all(np.abs(rgba[:, :, :3].astype(int) - NODATA_RGB) < 14, axis=2)
    ys, xs = np.nonzero(is_drawn & ~is_nodata)
    pixel_corners = np.array(
        [
            [xs[xs.argmin()], ys[xs.argmin()]],
            [xs[ys.argmin()], ys[ys.argmin()]],
            [xs[xs.argmax()], ys[xs.argmax()]],
            [xs[ys.argmax()], ys[ys.argmax()]],
        ]
    )
    vertices = np.array(footprint[:-1])
    lonlat_corners = np.array(
        [
            vertices[vertices[:, 0].argmin()],
            vertices[vertices[:, 1].argmax()],
            vertices[vertices[:, 0].argmax()],
            vertices[vertices[:, 1].argmin()],
        ]
    )
    return fit_pixel_to_lonlat(pixel_corners, lonlat_corners)


def image_corners(transform, width, height):
    pixels = np.array([[0, 0, 1], [width, 0, 1], [width, height, 1], [0, height, 1]])
    return np.round(pixels @ transform, 5).tolist()


def phase_roughness(rgba):
    """Color change to the next pixel. Smooth phase is a rough proxy for high coherence."""
    rgb = rgba[:, :, :3].astype(float)
    roughness = np.zeros(rgb.shape[:2])
    roughness[:-1, :] += np.abs(np.diff(rgb, axis=0)).sum(axis=2)
    roughness[:, :-1] += np.abs(np.diff(rgb, axis=1)).sum(axis=2)
    return roughness


def clean_signal_share(roughness, transform):
    inverse = np.linalg.inv(np.vstack([transform.T, [0, 0, 1]]))
    west, south, east, north = NORTH_JAKARTA_LAND
    (x0, y0, _), (x1, y1, _) = inverse @ [west, north, 1], inverse @ [east, south, 1]
    window = roughness[int(y0) : int(y1), int(x0) : int(x1)]
    return round(float((window < ROUGHNESS_LIMIT).mean()), 3)


def noisy_area(roughness):
    """Pixels whose neighbourhood is mostly noise, such as open sea."""
    clipped = Image.fromarray(np.clip(roughness, 0, 255).astype(np.uint8))
    neighbourhood = np.array(clipped.filter(ImageFilter.BoxBlur(4)))
    return neighbourhood > ROUGHNESS_LIMIT


def export_pair(feature):
    properties = feature["properties"]
    scene = properties["sceneName"]
    rgba = np.array(download_image(properties["browse"][0]))
    transform, residual = georeference(rgba, feature["geometry"]["coordinates"][0])

    roughness = phase_roughness(rgba)
    is_nodata = np.all(np.abs(rgba[:, :, :3].astype(int) - NODATA_RGB) < 14, axis=2)
    rgba[is_nodata | noisy_area(roughness), 3] = 0
    image_name = f"{scene}.webp"
    Image.fromarray(rgba).save(IMAGE_DIR / image_name, quality=82)

    reference_date, secondary_date = scene.split("_")[11][:8], scene.split("_")[13][:8]
    print(f"{reference_date}-{secondary_date} fit residual {residual:.4f} deg", file=sys.stderr)
    return {
        "id": scene,
        "referenceDate": f"{reference_date[:4]}-{reference_date[4:6]}-{reference_date[6:]}",
        "secondaryDate": f"{secondary_date[:4]}-{secondary_date[4:6]}-{secondary_date[6:]}",
        "image": f"/nisar/{image_name}",
        "corners": image_corners(transform, rgba.shape[1], rgba.shape[0]),
        "cleanSignalShare": clean_signal_share(roughness, transform),
    }


def main():
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    CATALOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    pairs = [export_pair(feature) for feature in search_gunw_granules()]
    catalog = {
        "product": "NISAR L2 GUNW provisional, browse image (wrapped phase)",
        "track": ASCENDING_TRACK,
        "direction": "ascending",
        "pairs": pairs,
    }
    CATALOG_PATH.write_text(json.dumps(catalog, indent=2) + "\n")
    print(f"wrote {len(pairs)} pairs to {IMAGE_DIR} and {CATALOG_PATH}", file=sys.stderr)


if __name__ == "__main__":
    main()
