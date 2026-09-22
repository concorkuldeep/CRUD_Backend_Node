const verifyWebhook = (req, res) => {
    console.log('========== WHATSAPP WEBHOOK VERIFY ==========');

    console.log('Query:', req.query);

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Mode:', mode);
    console.log('Token:', token);
    console.log('Challenge:', challenge);

    if (
        mode === 'subscribe' &&
        token === process.env.WHATSAPP_VERIFY_TOKEN
    ) {
        console.log('✅ WEBHOOK VERIFIED');

        return res.status(200).send(challenge);
    }

    console.log('❌ WEBHOOK VERIFICATION FAILED');

    return res.sendStatus(403);
};

const receiveWebhook = async (req, res) => {
    try {
        console.log('========== WHATSAPP MESSAGE ==========');

        const body = req.body;

        console.log(
            JSON.stringify(body, null, 2)
        );

        const entry = body?.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;

        const message = value?.messages?.[0];

        // Ignore events that don't contain a message
        if (!message) {
            console.log('No message found');
            return res.sendStatus(200);
        }

        // Only handle text messages for now
        if (message.type !== 'text') {
            console.log('Message type:', message.type);
            return res.sendStatus(200);
        }

        const phoneNumber = message.from;
        const userMessage = message.text?.body?.trim();
        const messageId = message.id;

        console.log('-----------------------------------');
        console.log('WhatsApp Number:', phoneNumber);
        console.log('Message ID:', messageId);
        console.log('Message:', userMessage);
        console.log('-----------------------------------');

        return res.sendStatus(200);

    } catch (error) {
        console.error('WhatsApp Webhook Error:', error);

        return res.sendStatus(500);
    }
};

module.exports = {
    verifyWebhook,
    receiveWebhook,
};

module.exports = {
    verifyWebhook,
    receiveWebhook,
};