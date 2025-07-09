const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',      // Gmail SMTP server
  port: 587,                   // Use 587 for STARTTLS
  secure: false,               // Must be false for STARTTLS
  auth: {
    user: process.env.webusername,
    pass: process.env.mailpass
  },
  tls: {
    rejectUnauthorized: false  // Fixes some SSL issues (safe for Gmail)
  }
});


function sendEmail({ recipient_email, subject, message }) {
  return new Promise((resolve, reject) => {
    const mail_configs = {
      from: 'arkcitylp@gmail.com',
      to: recipient_email,
      subject,
      html: message
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        return reject({ message: 'An error occurred while sending email.',error:error });
      }
      return resolve({ message: 'Email sent successfully.' });
    });
  });
}

module.exports = sendEmail;