export async function uploadToCloudflare(files) {
  const maxSize = 100 * 1024 * 1024; // 100MB
  const fileArray = Array.isArray(files) ? files : [files];
  
  // Validate file sizes
  for (const file of fileArray) {
    if (file.size > maxSize) {
      throw new Error(`File ${file.name} exceeds 100MB limit`);
    }
  }
  
  const formData = new FormData();
  fileArray.forEach(file => formData.append('files', file));

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return Array.isArray(files) ? data.files : data.files[0].url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}