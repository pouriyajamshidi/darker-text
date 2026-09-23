#!/usr/bin/env python3
"""Draws the toolbar icon: three lines of text fading from harsh white to gray.

Run it from the project root after changing the design:

    python3 icons/make_icons.py
"""

from PIL import Image, ImageDraw

SIZES = (16, 32, 48, 128)
SCALE = 8  # draw big, then shrink, so the curves come out smooth
BASE = 128

BACKGROUND = (23, 25, 28, 255)
LINES = (
    # top, width, color: the same text, dimmed one step at a time
    (34, 80, (255, 255, 255, 255)),
    (58, 80, (169, 174, 179, 255)),
    (82, 52, (92, 97, 102, 255)),
)


def draw(size):
    canvas = Image.new("RGBA", (size * SCALE,) * 2, (0, 0, 0, 0))
    pen = ImageDraw.Draw(canvas)
    unit = size * SCALE / BASE

    def box(x, y, width, height):
        return [x * unit, y * unit, (x + width) * unit, (y + height) * unit]

    pen.rounded_rectangle(box(0, 0, BASE, BASE), radius=28 * unit, fill=BACKGROUND)
    for top, width, color in LINES:
        pen.rounded_rectangle(box(24, top, width, 12), radius=6 * unit, fill=color)

    return canvas.resize((size, size), Image.LANCZOS)


for size in SIZES:
    draw(size).save(f"icons/icon-{size}.png")
    print(f"icons/icon-{size}.png")
