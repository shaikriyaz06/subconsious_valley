import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    let files = formData.getAll('files');
    
    // If no files found, check for single file
    if (files.length === 0) {
      const singleFile = formData.get('file');
      if (singleFile) {
        files = [singleFile];
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Check file sizes (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    for (const file of files) {
      if (file.size > maxSize) {
        return NextResponse.json({ error: `File ${file.name} exceeds 100MB limit` }, { status: 400 });
      }
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${process.env.CLOUDFLARE_BUCKET_NAME}/objects/${file.name}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_R2_TOKEN}`,
          'Content-Type': file.type,
        },
        body: buffer,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      return {
        filename: file.name,
        url: `https://cdn.subconsciousvalley.workers.dev/${file.name}`
      };
    });

    const results = await Promise.all(uploadPromises);
    
    // Return single file format for single uploads, array for multiple
    if (results.length === 1) {
      return NextResponse.json({ url: results[0].url, files: results });
    }
    return NextResponse.json({ files: results });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}