const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: process.env.SUPABASE_SMTP_USER,
        pass: process.env.SUPABASE_SMTP_PASS,
    },
});

exports.handler = async (event, context) => {
    const { websiteUrl, platformType, hostingProvider, setupEmail, preferredTemplates, customDomain, additionalNotes } = JSON.parse(event.body);

    const mailOptionsToOwner = {
        from: process.env.SUPABASE_SMTP_SENDER,
        to: process.env.SUPABASE_SMTP_RECEIVER,
        subject: 'CMS Setup Request',
        text: `
            Website URL: ${websiteUrl}
            Platform Type: ${platformType}
            Hosting Provider: ${hostingProvider}
            Setup Email: ${setupEmail}
            Preferred CMS Templates: ${preferredTemplates.join(', ')}
            Custom Domain Setup Needed: ${customDomain ? 'Yes' : 'No'}
            Additional Notes: ${additionalNotes}
        `,
    };

    const mailOptionsToUser = {
        from: process.env.SUPABASE_SMTP_SENDER,
        to: setupEmail,
        subject: 'Thank you for your CMS setup request',
        text: 'Thanks for your CMS setup request. One of our professionals will get back to you as soon as possible.',
    };

    try {
        await transporter.sendMail(mailOptionsToOwner);
        await transporter.sendMail(mailOptionsToUser);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Emails sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending email', error: error.message }),
        };
    }
};