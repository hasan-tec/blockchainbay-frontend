// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Contact form submission received:", body);
    
    const { name, email, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.error("Missing required fields in contact form submission");
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields" },
        { status: 400 }
      );
    }
    
    console.log("Sending contact form email from:", email);
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Test connection
    await transporter.verify().catch(err => {
      console.error("SMTP verification failed:", err);
      throw new Error(`SMTP connection failed: ${err.message}`);
    });
    
    const emailSubject = subject || "New Contact Form Submission";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    `;
    
    // Send email to your admin address
    const infoAdmin = await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_FROM, // Your admin email
      subject: `[Contact Form] ${emailSubject}`,
      html: htmlBody,
      text: htmlBody.replace(/<[^>]*>/g, ''), // Plain text version
      replyTo: email, // Set reply-to as the form submitter's email
    });
    
    console.log("Admin notification email sent:", infoAdmin.messageId);
    
    // Also send a confirmation email to the user
    const userHtmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We've received your message and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p>Best regards,<br>The CryptoHub Team</p>
      </div>
    `;
    
    const infoUser = await transporter.sendMail({
      from: `"CryptoHub Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We've received your message: ${emailSubject}`,
      html: userHtmlBody,
      text: userHtmlBody.replace(/<[^>]*>/g, ''), // Plain text version
    });
    
    console.log("Confirmation email sent to user:", infoUser.messageId);
    
    return NextResponse.json({ 
      success: true, 
      adminMessageId: infoAdmin.messageId,
      userMessageId: infoUser.messageId
    });
  } catch (error: unknown) {
    console.error('Contact form email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}