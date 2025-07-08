const sendEmail = require('../config/mailer');
const subscriptionMessage = async (req, res) => {
  if (!req.body.recipient_email) {
    return res.status(400).send({ message: 'Missing recipient_email.' });
  }

  try {
    await sendEmail(req.body);
    res.send({ message: 'Subscription email sent.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const sendSingleMessage = async (req, res) => {
  try {
    await sendEmail(req.body);
    res.send({ message: 'Email sent successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const sendNewsLetter =  async (req, res) => {
  const { subject, message, recipient_email } = req.body;

  if (!Array.isArray(recipient_email) || recipient_email.length === 0) {
    return res.status(400).send({ message: 'Invalid or missing recipient_email array.' });
  }

  try {
    await sendEmail({ subject, message, recipient_email: recipient_email.join(',') });
    res.send({ message: 'Newsletter sent.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

module.exports={subscriptionMessage, sendSingleMessage, sendNewsLetter}