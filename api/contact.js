import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // transporter authenticates with Gmail using an App Password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER, // Gmail account used to send emails
      pass: process.env.SMTP_PASS, // App Password
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER, // shows the submitter’s email
    replyTo: email, 
    to: [
      "krbo9035@colorado.edu"
    ],
    subject: `New contact form message from ${name}`,
    text: message,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Message sent!" });
    } catch (err) {
        console.error("Nodemailer error:", err); // <-- important: logs full error
        return res.status(500).json({ message: `Failed to send message: ${err.message}` });
    }
}
