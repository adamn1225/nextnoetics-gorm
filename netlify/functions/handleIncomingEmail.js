exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);

    console.log('Received email notification:', body);

    // Process the incoming email data as needed
    const sender = body.sender;
    const recipient = body.recipient;
    const subject = body.subject;
    const text = body['body-plain'];

    console.log(`Sender: ${sender}`);
    console.log(`Recipient: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);

    // You can also send a notification email or perform other actions here

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Email notification received successfully' }),
    };
};