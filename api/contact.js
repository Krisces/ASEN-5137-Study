import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const msg = {
    to: process.env.SENDGRID_RECIPIENTS.split(","), // array of recipients
    from: process.env.SENDGRID_SENDER,             // must be a verified sender
    replyTo: email,                                // submitter's email
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
    await sgMail.send(msg);
    return res.status(200).json({ message: "Message sent!" });
  } catch (error) {
    console.error("SendGrid error:", error.response ? error.response.body : error);
    return res.status(500).json({ message: "Failed to send message." });
  }
}
