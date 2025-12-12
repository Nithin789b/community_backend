import nodemailer from "nodemailer";

export const sendMail = async (req, res) => {
  try {
    const { donorMail } = req.body;
    const user = req.user;

    if (!donorMail) {
      return res.status(400).json({
        success: false,
        message: "Donor email is required",
      });
    }

    // Configure transporter (use Gmail SMTP or any service)
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another email service
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donorMail,
      subject: "Blood Request Notification",
      text: `Dear Donor,

You have received a new blood donation request through the Community Blood Support System.

Your willingness to donate blood can make a life-saving difference, and someone is currently in urgent need of your help.

Requester Details:
• Name: ${user.name}
• Mobile: ${user.mobile}
• Required Blood Group: ${user.bloodGroup} || B+  
• Location: ${user.address[0].district || "Shared via app"}

Message from Community:
We kindly request your support in this critical moment. If you are available and eligible to donate, please consider responding to this request.  
Even a single donation has the power to save a life.

Thank you for being a valued part of our community and for your continued compassion and generosity.

Warm regards,  
Community Health & Blood Support Team

`,
    };

    
    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error("Mail sending error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send mail",
      error: error.message,
    });
  }
};
