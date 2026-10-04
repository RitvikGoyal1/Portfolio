"""Five deterministic art treatments of the same photograph; no generative AI.

Requires Pillow and NumPy. Does not change the selected website portrait.
"""
from pathlib import Path
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/portrait-options"
OUT.mkdir(exist_ok=True)
W, H = 720, 900
photo = Image.open(ROOT / "public/ritvik.webp").convert("RGB")
outline = [(14,458),(22,413),(53,380),(109,349),(160,330),(164,299),
           (149,266),(139,221),(130,180),(128,146),(128,113),(140,79),
           (159,52),(185,30),(223,17),(260,18),(293,29),(320,53),
           (333,82),(332,118),(325,151),(327,178),(320,214),(310,251),
           (291,285),(295,321),(326,335),(368,351),(407,380),(437,411),
           (458,450),(459,459)]
mask = Image.new("L", (460,460), 0)
ImageDraw.Draw(mask).polygon(outline, fill=255)
# Remove blue studio-background spill only along the outer silhouette.
rgb = np.asarray(photo, dtype=float)
edge = np.asarray(mask) - np.asarray(mask.filter(ImageFilter.MinFilter(19)))
blue = (rgb[:,:,2] > rgb[:,:,0] + 7) & (rgb[:,:,2] > rgb[:,:,1] + 2)
matte = np.asarray(mask).copy()
matte[(edge > 0) & blue] = 0
mask = Image.fromarray(matte).filter(ImageFilter.GaussianBlur(.6))
photo = photo.resize((810,810), Image.Resampling.LANCZOS)
mask = mask.resize((810,810), Image.Resampling.LANCZOS)
tone = ImageOps.autocontrast(ImageOps.grayscale(photo), cutoff=.2)
tone = tone.point(lambda p: int(255 * (p / 255) ** .79))
smooth = tone.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(.6))
rng = np.random.default_rng(61)
Y, X = np.mgrid[:H,:W]

def save(image, slug):
    image.convert("RGB").save(OUT / f"{slug}.webp", quality=94, method=6)
    return image.convert("RGB")

def paper(color, amount=1.6):
    a = np.zeros((H,W,3), float) + np.array(color)
    a += rng.normal(0, amount, (H,W,1))
    return Image.fromarray(np.uint8(np.clip(a,0,255)))

def place(subject, background, alpha=mask):
    result = background.copy()
    result.paste(subject, (-45,95), alpha)
    return result

def ramp(gray, colors, stops=None):
    values = np.asarray(gray, dtype=float) / 255
    if stops is None: stops = np.linspace(0,1,len(colors))
    return Image.fromarray(np.uint8(np.stack([
        np.interp(values, stops, np.array(colors)[:,c]) for c in range(3)
    ], axis=-1)))

# 01: Film-poster tonal lighting, not an edge-detection sketch.
vignette = np.clip(1 - np.hypot((X-480)/850, (Y-260)/1050), 0, 1)
bg = np.array([7,20,31]) + vignette[:,:,None] * np.array([14,29,38])
bg += rng.normal(0,.85,(H,W,1))
bg = Image.fromarray(np.uint8(np.clip(bg,0,255)))
d = ImageDraw.Draw(bg)
d.arc((86,79,806,799), 167, 315, fill=(113,137,139), width=1)
subject = ramp(tone, [(7,23,34),(56,99,112),(163,186,180),(248,220,184)], [0,.37,.70,1])
one = save(place(subject,bg), "01-cinematic-duotone")

# 02: Layered spot-color print, paper grain, and slight ink misregistration.
bg = paper((243,230,205),2)
ImageDraw.Draw(bg).ellipse((58,66,668,676), fill=(223,99,79))
levels = np.digitize(np.asarray(smooth), [42,83,124,162,202])
palette = np.array([(31,45,57),(46,73,82),(190,70,61),(224,112,86),(239,169,121),(245,222,180)])
subject = Image.fromarray(np.uint8(palette[levels]))
registration = Image.new("RGB",subject.size,(219,76,60))
bg.paste(registration,(-40,97), mask)
two = place(subject,bg)
a = np.asarray(two,dtype=float)
a += rng.normal(0,2.8,(H,W,1))
speckle = rng.random((H,W)) > .975
a[speckle] = a[speckle] * .62 + np.array((243,230,205)) * .38
two = save(Image.fromarray(np.uint8(np.clip(a,0,255))), "02-risograph")

# 03: Comic-book spot colors with variable-radius halftone dots.
bg = paper((67,192,197),.6)
d = ImageDraw.Draw(bg)
d.ellipse((265,40,940,715),fill=(246,196,72))
d.polygon([(0,610),(0,900),(250,900),(695,0),(593,0)],fill=(230,73,117))
palette = np.array([(26,26,49),(72,47,106),(183,63,114),(245,139,94),(255,208,124),(255,235,176)])
levels = np.digitize(np.asarray(smooth),[33,70,115,157,203])
subject = Image.fromarray(np.uint8(palette[levels]))
sy,sx = np.mgrid[:810,:810]
darkness = 1 - np.asarray(smooth,dtype=float)/255
distance = np.hypot((sx+sy*.12)%7-3.5,sy%7-3.5)
dots = distance < (.55+1.3*darkness)
a = np.asarray(subject,dtype=float)
a[dots] = a[dots]*.42 + np.array((29,27,57))*.58
three = save(place(Image.fromarray(np.uint8(a)),bg), "03-pop-halftone")

# 04: Directional brush marks sampled from the source, with finer strokes
# around facial details. No features or geometry are synthesized or warped.
bg = paper((67,96,89),1)
d = ImageDraw.Draw(bg)
for _ in range(1500):
    x=int(rng.integers(-80,W)); y=int(rng.integers(-40,H))
    color=tuple(np.uint8(np.clip(np.array((68,95,86))+rng.normal(0,8,3),0,255)))
    d.line((x,y,x+int(rng.integers(20,110)),y-int(rng.integers(0,35))), fill=color,width=int(rng.integers(8,30)))
colored = ImageEnhance.Color(photo).enhance(.88)
colored = ImageEnhance.Brightness(colored).enhance(1.12)
target = place(colored,bg)
target_array = np.asarray(target,dtype=float)
field = np.asarray(ImageOps.grayscale(target).filter(ImageFilter.GaussianBlur(2)),dtype=float)
gy,gx = np.gradient(field)
paint = target.resize((48,60),Image.Resampling.BILINEAR).resize((W,H),Image.Resampling.BICUBIC)
draw = ImageDraw.Draw(paint)
for brush, step in [(19,17),(10,10),(5,6),(2,3)]:
    points = [(x,y) for y in range(0,H,step) for x in range(0,W,step)]
    rng.shuffle(points)
    for x,y in points:
        x=int(np.clip(x+rng.integers(-step//2,step//2+1),0,W-1))
        y=int(np.clip(y+rng.integers(-step//2,step//2+1),0,H-1))
        face = ((x-360)/195)**2+((y-424)/280)**2 < 1
        if brush <= 5 and not face and rng.random() < .88: continue
        theta = math.atan2(gy[y,x],gx[y,x])+math.pi/2
        if abs(gx[y,x])+abs(gy[y,x]) < 3: theta=-.3+rng.normal(0,.3)
        length=brush*(1.2+rng.random()*1.4)
        dx=math.cos(theta)*length; dy=math.sin(theta)*length
        color=tuple(np.uint8(np.clip(target_array[y,x]+rng.normal(0,1.6,3),0,255)))
        draw.line((x-dx/2,y-dy/2,x+dx/2,y+dy/2), fill=color,width=brush)
a = np.asarray(paint,dtype=float)
a += (np.sin(X*2.1)*.65 + np.sin(Y*2.2)*.65)[:,:,None]
a += rng.normal(0,.65,(H,W,1))
four = save(Image.fromarray(np.uint8(np.clip(a,0,255))), "04-painterly-color")

# 05: Actual low-resolution palette art, enlarged with nearest-neighbor pixels.
bg = Image.new("RGB",(W,H),(32,26,54))
d=ImageDraw.Draw(bg)
d.rectangle((0,585,W,H),fill=(46,35,66))
for i in range(0,W,72): d.line((i,585,i,H),fill=(66,45,87),width=1)
for i in range(585,H,54): d.line((0,i,W,i),fill=(66,45,87),width=1)
pixel_source=place(ImageEnhance.Color(colored).enhance(1.15),bg)
pixel=pixel_source.resize((80,100),Image.Resampling.LANCZOS).quantize(colors=28,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert("RGB")
d=ImageDraw.Draw(pixel)
for x,y in [(13,17),(67,23),(8,47),(69,51),(62,9)]:
    d.point((x,y-1),fill=(161,133,201));d.point((x,y+1),fill=(161,133,201))
    d.line((x-1,y,x+1,y),fill=(222,204,234))
five = save(pixel.resize((W,H),Image.Resampling.NEAREST), "05-pixel-portrait")

titles=["Cinematic duotone","Risograph print","Pop-art halftone","Painterly color","Pixel portrait"]
notes=["Midnight blue / warm light","Coral ink / textured paper","Bold color / comic dots","Brush texture / natural color","Limited palette / game art"]
board=Image.new("RGB",(1800,616),(18,21,20))
draw=ImageDraw.Draw(board)
font_root=Path("/System/Library/Fonts/Supplemental")
def font(size,bold=False):
    path=font_root/("Arial Bold.ttf" if bold else "Arial.ttf")
    return ImageFont.truetype(str(path),size) if path.exists() else ImageFont.load_default(size=size)
draw.text((32,23),"ONE PORTRAIT. FIVE DIRECTIONS.",font=font(22,True),fill=(237,234,219))
draw.text((32,53),"Original facial structure. Five different visual languages.",font=font(15),fill=(156,167,157))
for i,img in enumerate([one,two,three,four,five]):
    x=32+i*354
    board.paste(img.resize((320,400),Image.Resampling.LANCZOS if i!=4 else Image.Resampling.NEAREST),(x,96))
    draw.text((x,515),f"0{i+1}   {titles[i]}",font=font(20,True),fill=(237,234,219))
    draw.text((x,547),notes[i],font=font(15),fill=(167,178,166))
board.save(OUT/"comparison.jpg",quality=95,subsampling=0)
print("Created five portraits and public/portrait-options/comparison.jpg")
