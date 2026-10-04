"""Render a reproducible graphite study from Ritvik's existing public portrait.

Uses Pillow and NumPy. Tonal/edge processing only: no facial geometry is changed.
Run from the repository root; the original portrait remains untouched.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parent.parent
source = Image.open(ROOT / "public/ritvik.webp").convert("RGB")
size = 690
source = source.resize((size, size), Image.Resampling.LANCZOS)
gray = ImageOps.grayscale(source).filter(ImageFilter.MedianFilter(3))
tone = np.asarray(gray, dtype=np.float32) / 255
blur = np.asarray(gray.filter(ImageFilter.GaussianBlur(9)), dtype=np.float32) / 255
line = 1 - np.minimum(tone / (blur + 0.008), 1)

# Trace only the outside silhouette; the face, glasses, hair and expression
# come directly from the source pixels. This removes the studio backdrop.
silhouette = [
    (14, 458), (22, 413), (53, 380), (109, 349), (160, 330),
    (164, 299), (149, 266), (139, 221), (130, 180), (128, 146),
    (128, 113), (140, 79), (159, 52), (185, 30), (223, 17),
    (260, 18), (293, 29), (320, 53), (333, 82), (332, 118),
    (325, 151), (327, 178), (320, 214), (310, 251), (291, 285),
    (295, 321), (326, 335), (368, 351), (407, 380), (437, 411),
    (458, 450), (459, 459),
]
mask_image = Image.new("L", (size, size), 0)
ImageDraw.Draw(mask_image).polygon(
    [(round(x * size / 460), round(y * size / 460)) for x, y in silhouette],
    fill=255,
)
mask = np.asarray(mask_image.filter(ImageFilter.GaussianBlur(2)), dtype=np.float32) / 255

rng = np.random.default_rng(27)
y, x = np.mgrid[0:size, 0:size]
dark = np.clip(1 - tone, 0, 1)
# Fine crossed graphite strokes carry midtones while retaining clean highlights.
stroke_a = np.maximum(0, np.sin((x + y * 1.5) * 1.2 + np.sin(y * 0.06))) ** 14
stroke_b = np.maximum(0, np.sin((x - y * 1.1) * 1.05)) ** 18
hatch = (stroke_a * 0.19 + stroke_b * 0.11) * dark ** 1.5
ink = np.clip(line * 1.55 + dark ** 2 * 0.37 + hatch, 0, 0.94)
# The shoulders dissolve into the page, like an unfinished pencil drawing.
fade = np.clip((size - y) / 85, 0, 1)
ink *= mask * fade

height, width = 840, 720
paper = np.empty((height, width, 3), dtype=np.float32)
paper[:] = (236, 227, 207)
paper += rng.normal(0, 1.1, (height, width, 1))
left, top = 15, 73
graphite = np.array((52, 51, 43), dtype=np.float32)
area = paper[top:top + size, left:left + size]
area[:] = area * (1 - ink[..., None]) + graphite * ink[..., None]
result = Image.fromarray(np.uint8(np.clip(paper, 0, 255)))
result.save(ROOT / "public/ritvik-study.webp", quality=90, method=6)
print("Created public/ritvik-study.webp (720 × 840)")
