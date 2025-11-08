import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { fullName, email, preferredLanguage, subject, message } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailHtml = `
      <h3>New message from Subconscious Valley contact form:</h3>
      <hr>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Preferred Language:</strong> ${preferredLanguage}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      // to: 'hello@subconsciousvalley.com', // Always send to this email
      to: 'sajid.azure@gmail.com', // Always send to this email
      replyTo: email, // Allow replying to customer
      subject: `New Contact Form Submission: ${subject}`,
      text: `New message from Subconscious Valley contact form:\n-------------------------------------------------\nName: ${fullName}\nEmail: ${email}\nPreferred Language: ${preferredLanguage}\nSubject: ${subject}\n-------------------------------------------------\nMessage:\n${message}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}