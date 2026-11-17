import os
import subprocess
import struct
import shutil

BASE_DIR = '/Users/ayush/Documents/customize printing  website/Cprint-website'
LOGO_SRC = os.path.join(BASE_DIR, 'public/images/brand/rynochi-gold-logo.png')
TMP_DIR = '/tmp/rynochi_favicons'
os.makedirs(TMP_DIR, exist_ok=True)

# Helper to run sips command
def run_sips(args):
    cmd = ['sips'] + args
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error running {' '.join(cmd)}: {res.stderr}")
        return False
    return True

# 1. Create a master 512x512 square with logo centered (using 90% width to ensure padding)
master_512 = os.path.join(TMP_DIR, 'master_512.png')
temp_fit = os.path.join(TMP_DIR, 'temp_fit.png')
# Target fit size is 470px inside 512px
run_sips(['-Z', '470', LOGO_SRC, '--out', temp_fit])
run_sips(['-p', '512', '512', temp_fit, '--out', master_512])

sizes = [16, 32, 48, 64, 128, 180, 192, 512]
png_blobs = {}

for s in sizes:
    out_file = os.path.join(TMP_DIR, f'icon_{s}.png')
    # Resample master 512 to s x s
    run_sips(['-z', str(s), str(s), master_512, '--out', out_file])
    with open(out_file, 'rb') as f:
        png_blobs[s] = f.read()
    print(f"Generated {s}x{s} PNG: {len(png_blobs[s])} bytes")

# 2. Build multi-resolution ICO file (16, 32, 48)
ico_sizes = [16, 32, 48]
header = struct.pack('<HHH', 0, 1, len(ico_sizes))
entries = []
offset = 6 + 16 * len(ico_sizes)
data_blobs = []

for s in ico_sizes:
    data = png_blobs[s]
    w_byte = 0 if s >= 256 else s
    h_byte = 0 if s >= 256 else s
    entry = struct.pack('<BBBBHHII', w_byte, h_byte, 0, 0, 1, 32, len(data), offset)
    entries.append(entry)
    data_blobs.append(data)
    offset += len(data)

ico_data = header + b''.join(entries) + b''.join(data_blobs)
ico_tmp_path = os.path.join(TMP_DIR, 'favicon.ico')
with open(ico_tmp_path, 'wb') as f:
    f.write(ico_data)

print(f"Built favicon.ico with sizes {ico_sizes}: {len(ico_data)} bytes")

# 3. Deploy to public/ and src/app/
public_dir = os.path.join(BASE_DIR, 'public')
app_dir = os.path.join(BASE_DIR, 'src/app')

# Copy favicon.ico
shutil.copyfile(ico_tmp_path, os.path.join(public_dir, 'favicon.ico'))
shutil.copyfile(ico_tmp_path, os.path.join(app_dir, 'favicon.ico'))

# Copy favicon.png (64x64)
with open(os.path.join(public_dir, 'favicon.png'), 'wb') as f:
    f.write(png_blobs[64])

# Copy icon.png (512x512)
with open(os.path.join(public_dir, 'icon.png'), 'wb') as f:
    f.write(png_blobs[512])
with open(os.path.join(app_dir, 'icon.png'), 'wb') as f:
    f.write(png_blobs[512])

# Copy apple-touch-icon.png (180x180)
with open(os.path.join(public_dir, 'apple-touch-icon.png'), 'wb') as f:
    f.write(png_blobs[180])
with open(os.path.join(app_dir, 'apple-icon.png'), 'wb') as f:
    f.write(png_blobs[180])

print("All favicon and icon assets copied to public/ and src/app/ successfully!")

