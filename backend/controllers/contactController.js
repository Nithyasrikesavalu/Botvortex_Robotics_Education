import Contact from "../models/Contact.js";
import transporter from "../config/mail.js";

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Save to database
        const newMessage = await Contact.create({
            name,
            email,
            subject,
            message
        });

        // Send notification email to admin
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER, // Admin
                subject: `New Contact Form Submission: ${subject}`,
                html: `
                  <h3>New Message from ${name}</h3>
                  <p><b>Email:</b> ${email}</p>
                  <p><b>Subject:</b> ${subject}</p>
                  <p><b>Message:</b></p>
                  <p>${message}</p>
                  <br/>
                  <p><i>This message was submitted via BotVortex Contact Form.</i></p>
                `
            });
            console.log("📧 Contact notification email sent to admin");

            // Send acknowledgement email to the user
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email, // The user who submitted the form
                subject: `We've received your message - BotVortex`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <h2 style="color: #2563eb;">Hello ${name},</h2>
                    <p>Thank you for reaching out to <b>BotVortex</b>! We have received your message regarding "<b>${subject}</b>".</p>
                    <p>Our team is currently reviewing your inquiry and we will get back to you as soon as possible (usually within 24 hours).</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 0.9rem; color: #64748b;"><i>Your message summary:</i></p>
                    <blockquote style="background: #f8fafc; padding: 10px; border-left: 4px solid #2563eb; color: #475569;">
                      ${message}
                    </blockquote>
                    <p style="margin-top: 20px;">Best regards,<br/><b>The BotVortex Team</b></p>
                  </div>
                `
            });
            console.log("📧 Acknowledgement email sent to user");

        } catch (mailError) {
            console.error("❌ Failed to send emails:", mailError);
        }

        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        console.error("❌ CONTACT FORM ERROR:", error);
        res.status(500).json({ message: "Server error while sending message" });
    }
};
