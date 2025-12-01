import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    await connectDB();

    // Find and validate reset token
    const resetRecord = await PasswordReset.findOne({ 
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email: resetRecord.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and allow both login methods
    const updateResult = await User.findByIdAndUpdate(user._id, { 
      password: hashedPassword,
      provider: 'mixed', // Allow both Google and credentials login
      updatedAt: new Date()
    }, { new: true });

    

    // Mark reset token as used
    const tokenUpdateResult = await PasswordReset.findByIdAndUpdate(resetRecord._id, { 
      used: true 
    }, { new: true });

    

    return NextResponse.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}