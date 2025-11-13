import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';
// Remove auth check for now - will be handled by middleware

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const session = await Session.findById(id);
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // Skip auth check for now
    // const session = await getServerSession();
    
    // Auth check temporarily disabled - should be handled by middleware
    // if (!session?.user?.role || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    await dbConnect();
    const { id } = await params;
    const updateData = await request.json();
    
    const updatedSession = await Session.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}