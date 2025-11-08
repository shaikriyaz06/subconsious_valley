export async function GET() {
  return Response.json({ message: 'Hello from API!' });
}

export async function POST(request) {
  const data = await request.json();
  return Response.json({ message: 'Data received', data });
}