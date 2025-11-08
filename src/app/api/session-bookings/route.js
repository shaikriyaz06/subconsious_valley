import dbConnect from '@/lib/mongodb'
import SessionBooking from '@/models/SessionBooking'
import { getServerSession } from 'next-auth'

export async function GET(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const bookings = await SessionBooking.find({ 
      user_email: session.user.email
    }).sort({ scheduled_date: 1 })

    return Response.json(bookings)

  } catch (error) {
    console.error('Error fetching session bookings:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      session_id, 
      session_title, 
      scheduled_date, 
      language_preference, 
      notes, 
      amount_paid 
    } = await request.json()

    await dbConnect()

    const booking = await SessionBooking.create({
      session_id,
      session_title,
      user_email: session.user.email,
      user_name: session.user.name,
      scheduled_date: new Date(scheduled_date),
      status: 'pending',
      language_preference,
      notes,
      payment_status: 'pending',
      amount_paid
    })

    return Response.json(booking, { status: 201 })

  } catch (error) {
    console.error('Error creating session booking:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}