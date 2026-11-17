/**
 * RYNOCHI Cloud Image Upload & Canvas Compression Utility
 * Compresses camera photos from 10MB down to ~120KB for instantaneous upload,
 * then uploads to Supabase Cloud Storage bucket 'product-images'.
 */

export async function compressImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<File> {
  // SVG or small icons (< 150KB) don't need raster compression
  if (file.type === 'image/svg+xml' || file.size < 150 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const ext = mimeType === 'image/png' ? 'png' : 'jpg';
            const cleanName = file.name.replace(/\.[^/.]+$/, `.${ext}`);
            const compressedFile = new File([blob], cleanName, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function uploadProductImage(
  file: File,
  bucket = 'product-images'
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    // 1. Client-side canvas compression
    const compressed = await compressImageFile(file);

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append('file', compressed);
    formData.append('bucket', bucket);

    // 3. Upload to server API -> Supabase Cloud Storage
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return { success: true, url: data.url };
  } catch (error: any) {
    console.error('Image upload failed:', error);
    return {
      success: false,
      url: '',
      error: error?.message || 'Upload failed',
    };
  }
}
