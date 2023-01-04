import process from 'process';

export = {
    bot: {
        token: process.env.BOT_TOKEN ?? '',
        image: process.env.BOT_IMAGE ?? '',
        id: process.env.APP_ID ?? '',
        feedbackWebhook: process.env.FEEDBACK_WEBHOOK ?? '',
    },
    owner: {
        id: process.env.OWNER_ID ?? '',
    },
}