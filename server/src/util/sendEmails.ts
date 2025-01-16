// utils/sendEmail.ts
const nodemailer = require("nodemailer");
export default async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Your Company" <no-reply@yourcompany.com>',
    to,
    subject,
    html,
  });
}
