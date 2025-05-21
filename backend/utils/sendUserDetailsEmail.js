const nodemailer = require("nodemailer");

// Function to create a nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587, // Default to 587 if not provided
    secure: process.env.SMTP_PORT === '465', // Use strict equality (===) for comparison
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Function to send email
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: options.attachments || [], // Optional attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Email sent to: ${options.email}`); // Log in non-production environments
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error sending email:', error); // Log in non-production environments
    }
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Sends the user's account details after successful registration
 * @param {Object} newUser - The newly registered user object
 * @param {Object} tempUser - The temporary user object that was in the temp storage
 */
const sendUserDetailsEmail = async (newUser, tempUser) => {
  try {
    const emailMessage = `Dear ${newUser.name},\n\nYour registration is complete! Here are your account details:\n\n
      User ID: ${newUser._id}\n
      Password: ${tempUser.password}\n
      Referral ID: ${newUser.referralId}\n
      Phone Number: ${newUser.phone}\n\n
      You can now log in and start using your account.\n\n
      Best regards,\nKyrios Fx Advisory Team.`;

    await sendEmail({
      email: newUser.email,
      subject: "Your Kyrios Fx Advisory Account Details",
      message: emailMessage,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email with user details.');
  }
};

module.exports = { sendUserDetailsEmail };
