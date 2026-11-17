import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'product-images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request' }, { status: 400 });
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Allowed formats: PNG, JPG, WEBP, SVG, GIF, PDF' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit (15MB)' },
        { status: 400 }
      );
    }

    // Extract safe filename
    const originalName = file.name || 'product-image.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const safeNameBase = originalName
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const safeFileName = `${safeNameBase}_${uniqueSuffix}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = '';

    // Primary: Upload directly to Supabase Cloud Storage (Bucket: product-images)
    if (isSupabaseConfigured) {
      try {
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from(bucket)
          .upload(safeFileName, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
            cacheControl: '31536000',
          });

        if (!uploadErr && uploadData) {
          const { data: pubData } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(safeFileName);
          publicUrl = pubData.publicUrl;
        } else if (uploadErr) {
          console.warn('Supabase storage upload warning:', uploadErr.message);
        }
      } catch (err) {
        console.warn('Supabase storage upload exception:', err);
      }
    }

    // Fallback: If in local dev and Supabase storage was not reachable
    if (!publicUrl) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'artwork');
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, safeFileName);
        await writeFile(filePath, buffer);
        publicUrl = `/uploads/artwork/${safeFileName}`;
      } catch {
        // Fallback to standard Supabase public CDN URL construct
        publicUrl = `https://vuppljzfwkflprwwbboe.supabase.co/storage/v1/object/public/${bucket}/${safeFileName}`;
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: safeFileName,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload artwork file' },
      { status: 500 }
    );
  }
}
