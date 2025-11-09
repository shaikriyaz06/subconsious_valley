import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    console.log('Registration attempt:', { name, email, password: '***' });

    if (!name || !email || !password) {
      console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate name (only alphabets and spaces, minimum 2 characters)
    if (!/^[a-zA-Z\s]{2,}$/.test(name.trim())) {
      console.log('Name validation failed:', name);
      return Response.json(
        { error: "Name should contain only alphabets and spaces (minimum 2 characters)" },
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('Email validation failed:', email);
      return Response.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return Response.json(
        { error: "Password must contain at least one lowercase letter" },
        { status: 400 }
      );
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return Response.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 }
      );
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return Response.json(
        {
          error:
            "Password must contain at least one special character (!@#$%^&*)",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password with bcrypt (12 rounds for security)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with hashed password
    const user = await User.create({
      full_name: name,
      email,
      password: hashedPassword,
      provider: "credentials",
      role: "user",
    });

    return Response.json(
      {
        message: "User created successfully",
        user: { id: user._id, full_name: user.full_name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
