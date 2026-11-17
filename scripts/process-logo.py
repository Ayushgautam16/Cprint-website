import struct, zlib

def write_png(filename, width, height, rgba_data):
    def chunk(tag, data):
        c = tag + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    raw = b''.join(b'\x00' + rgba_data[y*width*4 : (y+1)*width*4] for y in range(height))
    compressed = zlib.compress(raw, 9)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png)
    print(f'Wrote {filename}: {width}x{height}, {len(png)} bytes')

with open('/tmp/rynochi-highres.bmp', 'rb') as f:
    data = f.read()

offset = struct.unpack('<I', data[10:14])[0]
width = struct.unpack('<i', data[18:22])[0]
height = struct.unpack('<i', data[22:26])[0]
bpp = struct.unpack('<H', data[28:30])[0]

print(f'Source BMP: width={width}, height={height}, bpp={bpp}')

abs_h = abs(height)
row_size = ((width * bpp + 31) // 32) * 4

# Step 1: Detect bounding box
min_x, max_x = width, 0
min_y, max_y = abs_h, 0

for y in range(abs_h):
    row_start = offset + (abs_h - 1 - y if height > 0 else y) * row_size
    for x in range(width):
        px = row_start + x * (bpp // 8)
        b, g, r = data[px], data[px+1], data[px+2]
        if r < 240 or g < 240 or b < 240:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

print(f'Detected Bounding Box: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]')

# Add subtle margin of 10px
pad = 10
min_x = max(0, min_x - pad)
max_x = min(width - 1, max_x + pad)
min_y = max(0, min_y - pad)
max_y = min(abs_h - 1, max_y + pad)

out_w = max_x - min_x + 1
out_h = max_y - min_y + 1
print(f'Cropped dimensions: {out_w} x {out_h}')

# Step 2: Create Transparent PNG & Clean White BG PNG
rgba_transparent = bytearray(out_w * out_h * 4)
rgba_white_bg = bytearray(out_w * out_h * 4)

for y_out in range(out_h):
    y_in = min_y + y_out
    row_start = offset + (abs_h - 1 - y_in if height > 0 else y_in) * row_size
    for x_out in range(out_w):
        x_in = min_x + x_out
        px = row_start + x_in * (bpp // 8)
        b, g, r = data[px], data[px+1], data[px+2]

        out_idx = (y_out * out_w + x_out) * 4

        # For white bg version:
        rgba_white_bg[out_idx] = r
        rgba_white_bg[out_idx+1] = g
        rgba_white_bg[out_idx+2] = b
        rgba_white_bg[out_idx+3] = 255

        # For transparent version:
        # Calculate distance from white (255, 255, 255)
        # Background is white. Gold pixels have lower Blue (e.g. blue is 0 to 150)
        # White has r=255, g=255, b=255
        whiteness = min(r, g, b)
        if whiteness >= 253:
            # Pure white background
            alpha = 0
            out_r, out_g, out_b = 0, 0, 0
        elif whiteness > 230:
            # Anti-aliased transition edge
            alpha = int(255 * (1.0 - (whiteness - 230) / (255 - 230)))
            # Defringe white
            factor = alpha / 255.0
            out_r = max(0, min(255, int((r - 255 * (1 - factor)) / factor))) if factor > 0 else 0
            out_g = max(0, min(255, int((g - 255 * (1 - factor)) / factor))) if factor > 0 else 0
            out_b = max(0, min(255, int((b - 255 * (1 - factor)) / factor))) if factor > 0 else 0
        else:
            alpha = 255
            out_r, out_g, out_b = r, g, b

        rgba_transparent[out_idx] = out_r
        rgba_transparent[out_idx+1] = out_g
        rgba_transparent[out_idx+2] = out_b
        rgba_transparent[out_idx+3] = alpha

# Step 3: Save to Cprint-website/public/images/brand/
import os
os.makedirs('/Users/ayush/Documents/customize printing  website/Cprint-website/public/images/brand', exist_ok=True)

write_png(
    '/Users/ayush/Documents/customize printing  website/Cprint-website/public/images/brand/rynochi-gold-logo.png',
    out_w,
    out_h,
    bytes(rgba_transparent)
)

write_png(
    '/Users/ayush/Documents/customize printing  website/Cprint-website/public/images/brand/rynochi-gold-logo-white.png',
    out_w,
    out_h,
    bytes(rgba_white_bg)
)

# Also extract just the Wings Emblem (Top 65% of the height)
wing_h = int(out_h * 0.65)
rgba_wings = bytearray(out_w * wing_h * 4)
for y in range(wing_h):
    src_start = y * out_w * 4
    dst_start = y * out_w * 4
    rgba_wings[dst_start : dst_start + out_w*4] = rgba_transparent[src_start : src_start + out_w*4]

write_png(
    '/Users/ayush/Documents/customize printing  website/Cprint-website/public/images/brand/rynochi-wings-emblem.png',
    out_w,
    wing_h,
    bytes(rgba_wings)
)

# Also copy to root public for favicon and icons
import shutil
shutil.copyfile(
    '/Users/ayush/Documents/customize printing  website/Cprint-website/public/images/brand/rynochi-gold-logo.png',
    '/Users/ayush/Documents/customize printing  website/Cprint-website/public/logo.png'
)
shutil.copyfile(
    '/Users/ayush/Documents/customize printing  website/Cprint-website/public/images/brand/rynochi-wings-emblem.png',
    '/Users/ayush/Documents/customize printing  website/Cprint-website/public/icon.png'
)
print('All brand logo assets extracted and written successfully!')

