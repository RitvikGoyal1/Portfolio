"""Refine the selected duotone portrait using the original photo's pixels.

Pillow/NumPy only. No facial reshaping or generative reconstruction.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
source = Image.open(ROOT / "public/ritvik.webp").convert("RGB")
outline = [(14,458),(22,413),(53,380),(109,349),(160,330),(164,299),
           (149,266),(139,221),(130,180),(128,146),(128,113),(140,79),
           (159,52),(185,30),(223,17),(260,18),(293,29),(320,53),
           (333,82),(332,118),(325,151),(327,178),(320,214),(310,251),
           (291,285),(295,321),(326,335),(368,351),(407,380),(437,411),
           (458,450),(459,459)]
mask = Image.new("L", source.size, 0)
ImageDraw.Draw(mask).polygon(outline, fill=255)
rgb = np.asarray(source, dtype=float)
edge = np.asarray(mask) - np.asarray(mask.filter(ImageFilter.MinFilter(19)))
background = (rgb[:,:,2] > rgb[:,:,0]+4) & (rgb[:,:,2] > rgb[:,:,1]+1)
matte = np.asarray(mask).copy()
matte[(edge > 0) & background] = 0
mask = Image.fromarray(matte).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.55))

# Light denoising before enlargement retains the original eyes, glasses and hair.
gray = ImageOps.autocontrast(ImageOps.grayscale(source), cutoff=.2)
gray = Image.blend(gray, gray.filter(ImageFilter.MedianFilter(3)), .28)
gray = gray.resize((810,810), Image.Resampling.LANCZOS)
gray = gray.filter(ImageFilter.UnsharpMask(radius=1.15, percent=65, threshold=3))
values = (np.asarray(gray,dtype=float)/255) ** .76
# Smooth tonal mapping keeps the chosen midnight-blue / warm-light treatment.
colors = np.array([(8,25,36),(52,93,105),(160,184,179),(242,219,190)])
stops = [0,.37,.70,1]
color = np.stack([np.interp(values,stops,colors[:,c]) for c in range(3)],axis=-1)
portrait = Image.fromarray(np.uint8(color))

y,x = np.mgrid[:900,:720]
glow = np.exp(-(((x-407)/430)**2+((y-340)/590)**2))
backdrop = np.array((9,22,32)) + glow[:,:,None]*np.array((8,18,24))
image = Image.fromarray(np.uint8(backdrop))
image.paste(portrait,(-45,95),mask.resize((810,810),Image.Resampling.LANCZOS))
image.save(ROOT / "public/ritvik-duotone.webp",quality=96,method=6)
print("Saved public/ritvik-duotone.webp · 720 × 900")
