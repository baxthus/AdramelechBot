import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { SlashCommandBuilder, EmbedBuilder, User } from 'discord.js';
import config from '../config';

interface IMessage {
    user: User;
    message: string;
}

const sendDM: Command = {
    data: new SlashCommandBuilder()
        .setName('send-dm')
        .setDescription('DM a message (bot owner only)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Mention a user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Your message')
                .setRequired(true)),
    async execute(intr) {
        if (intr.user.id !== config.owner.id) {
            await errorResponse(intr, 'Your not the bot owner');
            return;
        }

        const content: IMessage = {
            user: intr.options.getUser('user', true),
            message: intr.options.getString('message', true),
        };

        try {
            await content.user.send(content.message);
        } catch {
            await errorResponse(intr, 'Error sending message');
            return;
        }

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(config.bot.embedColor)
                    .setTitle('__Adramelech DM Sender__')
                    .setDescription('Message send successfully!')
                    .setThumbnail(config.bot.image),
            ],
        });
    },
};

export = sendDM;