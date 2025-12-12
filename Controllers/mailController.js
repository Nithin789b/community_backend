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
      text: `You have a new blood request. Please check the app for details. ${user.name} has requested your help.please contact them at ${user.mobile}.`,
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
