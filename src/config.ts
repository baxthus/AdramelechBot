import process from 'process';

//* this will eventually be used to validate the config
//* just not yet because it's all string anyway
// interface BotConfig {
//     bot: {
//         token: string;
//         image: string;
//         id: string;
//         feedbackWebhook: string;
//     }
//     owner: {
//         id: string;
//     }
// }

const config = {
    bot: {
        token: process.env.BOT_TOKEN ?? '',
        image: process.env.BOT_IMAGE ?? '',
        id: process.env.APP_ID ?? '',
        feedbackWebhook: process.env.FEEDBACK_WEBHOOK ?? '',
    },
    owner: {
        id: process.env.OWNER_ID ?? '',
    },
};

export default config;