import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { saveContactMessage } from '../models/contactModel';

export const sendContactMessage = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, inquiryType, message, subscribe } = req.body;

  // --- Validation ---
  if (!firstName || !lastName || !email || !message) {
    res.status(400).json({ success: false, error: 'All required fields must be filled.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ success: false, error: 'Invalid email address.' });
    return;
  }

  try {
    // --- Save to Database ---
    await saveContactMessage({
      first_name: firstName,
      last_name: lastName,
      email,
      inquiry_type: inquiryType || 'General Inquiry',
      message,
      subscribe: !!subscribe,
    });

    // --- Send Email via Nodemailer ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Gemellery Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `[${inquiryType || 'General Inquiry'}] New message from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table cellpadding="8" style="border-collapse:collapse; width:100%">
          <tr><td><strong>Name</strong></td><td>${firstName} ${lastName}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
          <tr><td><strong>Inquiry Type</strong></td><td>${inquiryType}</td></tr>
          <tr><td><strong>Subscribe</strong></td><td>${subscribe ? 'Yes' : 'No'}</td></tr>
          <tr><td><strong>Message</strong></td><td>${message}</td></tr>
        </table>
      `,
    });

    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
};