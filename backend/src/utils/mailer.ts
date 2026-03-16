import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: any[]
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Gemellery" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments
  });
};
