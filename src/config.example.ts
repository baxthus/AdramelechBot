// Rename this file to config.ts
// Add an env called BOT_TOKEN with the bot's token
// Add an env called APP_ID with the bot's application ID
// Configure the bot image in this file
// Configure your ID in this file

import process from 'process';

export = {
    bot: {
        token: process.env.BOT_TOKEN || '',
        image: 'BOT_IMAGE_HERE',
        id: process.env.APP_ID || '',
    },
    owner: {
        id: 'YOUR_ID_HERE',
    },
}