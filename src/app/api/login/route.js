import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Validate password
    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
      return Response.json({ error: 'Invalid password format' }, { status: 400 })
    }

    await dbConnect()

    // Find user by email
    const user = await User.findOne({ email, provider: 'credentials' })
    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    return Response.json({ 
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}