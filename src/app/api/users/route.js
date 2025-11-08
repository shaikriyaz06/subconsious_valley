export async function GET() {
  return Response.json({ users: [] });
}

export async function POST(request) {
  const userData = await request.json();
  return Response.json({ message: 'User created', user: userData });
}