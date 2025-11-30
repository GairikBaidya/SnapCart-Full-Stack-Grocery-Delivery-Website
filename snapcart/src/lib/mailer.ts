import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,  // email
    pass: process.env.MAIL_PASS,  // app password
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"SnapCart" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
