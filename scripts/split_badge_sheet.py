from __future__ import annotations

import argparse
from pathlib import Path
from typing import List, Tuple

from PIL import Image


MAGENTA = (255, 0, 255)


def is_foreground(pixel: tuple[int, int, int], tolerance: int) -> bool:
    r, g, b = pixel[:3]
    return not (
        abs(r - MAGENTA[0]) <= tolerance
        and abs(g - MAGENTA[1]) <= tolerance
        and abs(b - MAGENTA[2]) <= tolerance
    )


def intervals_from_projection(values: List[int], min_run: int = 10) -> List[Tuple[int, int]]:
    intervals: List[Tuple[int, int]] = []
    start = None
    for i, value in enumerate(values):
        if value > 0 and start is None:
            start = i
        elif value == 0 and start is not None:
            if i - start >= min_run:
                intervals.append((start, i))
            start = None
    if start is not None and len(values) - start >= min_run:
        intervals.append((start, len(values)))
    return intervals


def alpha_bbox(img: Image.Image, tolerance: int) -> tuple[int, int, int, int] | None:
    width, height = img.size
    xs: List[int] = []
    ys: List[int] = []
    for y in range(height):
        for x in range(width):
            if is_foreground(img.getpixel((x, y)), tolerance):
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def remove_magenta_to_alpha(img: Image.Image, tolerance: int) -> Image.Image:
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pixels[x, y]
            if (
                abs(r - MAGENTA[0]) <= tolerance
                and abs(g - MAGENTA[1]) <= tolerance
                and abs(b - MAGENTA[2]) <= tolerance
            ):
                pixels[x, y] = (r, g, b, 0)
    return rgba


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--names", required=True, help="Comma-separated output base names in left-to-right top-to-bottom order")
    parser.add_argument("--tolerance", type=int, default=24)
    parser.add_argument("--pad", type=int, default=24)
    args = parser.parse_args()

    source = Image.open(args.input).convert("RGB")
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    names = [name.strip() for name in args.names.split(",") if name.strip()]

    row_projection = []
    for y in range(source.height):
        count = 0
        for x in range(source.width):
            if is_foreground(source.getpixel((x, y)), args.tolerance):
                count += 1
        row_projection.append(count)
    row_intervals = intervals_from_projection(row_projection, min_run=30)

    boxes: List[Tuple[int, int, int, int]] = []
    for y0, y1 in row_intervals:
        col_projection = []
        for x in range(source.width):
            count = 0
            for y in range(y0, y1):
                if is_foreground(source.getpixel((x, y)), args.tolerance):
                    count += 1
            col_projection.append(count)
        col_intervals = intervals_from_projection(col_projection, min_run=30)
        for x0, x1 in col_intervals:
            crop = source.crop((x0, y0, x1, y1))
            bbox = alpha_bbox(crop, args.tolerance)
            if bbox is None:
                continue
            bx0, by0, bx1, by1 = bbox
            boxes.append((x0 + bx0, y0 + by0, x0 + bx1, y0 + by1))

    boxes.sort(key=lambda b: (b[1], b[0]))

    if len(boxes) != len(names):
        raise SystemExit(f"Expected {len(names)} sticker boxes, found {len(boxes)}")

    for box, name in zip(boxes, names):
        x0, y0, x1, y1 = box
        x0 = max(0, x0 - args.pad)
        y0 = max(0, y0 - args.pad)
        x1 = min(source.width, x1 + args.pad)
        y1 = min(source.height, y1 + args.pad)
        sticker = source.crop((x0, y0, x1, y1))
        sticker_rgba = remove_magenta_to_alpha(sticker, args.tolerance)
        sticker_rgba.save(out_dir / f"{name}.png")


if __name__ == "__main__":
    main()
