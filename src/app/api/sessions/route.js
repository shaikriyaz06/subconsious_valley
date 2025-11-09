import dbConnect from "@/lib/mongodb";
import Session from "@/models/Session";

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'parent', 'child', or 'all'
    
    let query = {};
    
    if (type === 'parent') {
      query.parent_id = null; // Only parent sessions
    } else if (type === 'child') {
      query.parent_id = { $ne: null }; // Only child sessions
    }
    // If type is 'all' or not specified, return all sessions
    
    const sessions = await Session.find(query);
    
    // Generate ETag based on data hash
    const dataString = JSON.stringify(sessions);
    const etag = `"${Buffer.from(dataString).toString('base64').slice(0, 16)}"`;
    
    // Check if client has current version
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new Response(null, { status: 304 });
    }
    
    return Response.json(sessions, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=300' // 5 minutes browser cache
      }
    });
  } catch (error) {
    console.error('Sessions API error:', error);
    return Response.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  
  // If creating a parent session with child_sessions, ensure parent_id is null
  if (data.child_sessions && data.child_sessions.length > 0) {
    data.parent_id = null;
  }
  
  const session = await Session.create(data);
  return Response.json(session);
}
