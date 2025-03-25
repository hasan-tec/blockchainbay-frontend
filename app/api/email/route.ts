// app/api/email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      console.log("Email API received body:", body);
      
      const { winnerEmail, winnerName, giveawayTitle } = body;
      
      // Validate recipient
      if (!winnerEmail) {
        console.error("Missing recipient email in request");
        return NextResponse.json(
          { success: false, error: "Missing recipient email" },
          { status: 400 }
        );
      }
      
      console.log("Sending email to:", winnerEmail);
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
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
      
      const subject = `Congratulations! You won the ${giveawayTitle} giveaway!`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Congratulations, ${winnerName || 'Winner'}!</h2>
          <p>We're excited to inform you that you've been selected as the winner of our "${giveawayTitle}" giveaway.</p>
          <p>To claim your prize, please reply to this email with your preferred contact information.</p>
          <p>Thank you for participating!</p>
          <p>Best regards,<br>The BlockchainBay Team</p>
        </div>
      `;
      
      const info = await transporter.sendMail({
        from: `"BlockchainBay Team" <${process.env.EMAIL_USER}>`,
        to: winnerEmail,
        subject: subject,
        html: htmlBody,
        text: htmlBody.replace(/<[^>]*>/g, ''), // Plain text version
      });
      
      console.log("Email sent successfully:", info.messageId);
      
      return NextResponse.json({ 
        success: true, 
        messageId: info.messageId 
      });
    } catch (error: unknown) {
      console.error('Email sending error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        }, 
        { status: 500 }
      );
    }
  }