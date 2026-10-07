import sys
from pathlib import Path

sys.path.insert(0, str(Path(".tmp/pymupdf").resolve()))

import pymupdf  # type: ignore

source = Path("public/mie-tech/mie-tech-logo.pdf")
full_output = Path("public/mie-tech/mie-tech-logo-full.png")
trimmed_output = Path("public/mie-tech/mie-tech-logo.png")

doc = pymupdf.open(source)
page = doc[0]
matrix = pymupdf.Matrix(4, 4)
pix = page.get_pixmap(matrix=matrix, alpha=True)
pix.save(full_output)

samples = pix.samples
channels = pix.n
width = pix.width
height = pix.height

left = width
top = height
right = -1
bottom = -1

for y in range(height):
    row = y * width * channels
    for x in range(width):
        base = row + x * channels
        r = samples[base]
        g = samples[base + 1]
        b = samples[base + 2]
        a = samples[base + 3] if channels == 4 else 255
        visible = a > 8 and not (r > 248 and g > 248 and b > 248)
        if visible:
            left = min(left, x)
            top = min(top, y)
            right = max(right, x)
            bottom = max(bottom, y)

if right < left or bottom < top:
    raise SystemExit("No visible logo pixels found in rendered PDF.")

padding = 24
rect = pymupdf.IRect(
    max(0, left - padding),
    max(0, top - padding),
    min(width, right + padding),
    min(height, bottom + padding),
)
clip = pymupdf.Rect(rect.x0 / 4, rect.y0 / 4, rect.x1 / 4, rect.y1 / 4)
page.get_pixmap(matrix=matrix, alpha=True, clip=clip).save(trimmed_output)
print(f"Rendered {trimmed_output} from page {width}x{height}, crop={tuple(rect)}")
