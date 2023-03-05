import { ColorResolvable } from 'discord.js';
import process from 'process';

interface BotConfig {
    bot: {
        token: string;
        image: string;
        id: string;
        feedbackWebhook: string;
        openWeatherKey: string;
        embedColor: ColorResolvable;
    }
    owner: {
        id: string;
    }
}

const config: BotConfig = {
    bot: {
        token: process.env.BOT_TOKEN ?? '',
        image: 'https://cdn.abysmal.eu.org/adramelech.png',
        id: process.env.APP_ID ?? '',
        feedbackWebhook: process.env.FEEDBACK_WEBHOOK ?? '',
        openWeatherKey: process.env.OPEN_WEATHER_KEY ?? '',
        embedColor: [203, 166, 247],
    },
    owner: {
        id: process.env.OWNER_ID ?? '',
    },
};

export default config;
export const embedColor = config.bot.embedColor;
export const botImage = config.bot.image;