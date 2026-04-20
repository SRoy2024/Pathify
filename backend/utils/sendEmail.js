const sendEmail = async (options) => {
  const apiKey = process.env.EMAIL_API_KEY;

  if (!apiKey) {
    console.warn('EMAIL_API_KEY is not defined. Skipping email send.');
    return;
  }

  try {
    console.log(`Sending email to: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);

    // Hypothetical generic email API call
    // const response = await fetch('https://api.mockemailprovider.com/v1/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${apiKey}`
    //   },
    //   body: JSON.stringify({
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message,
    //     from: 'noreply@pathify.edu'
    //   })
    // });
    
    // if (!response.ok) throw new Error('Email sending failed');

    console.log('Email sent successfully via mock provider!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
