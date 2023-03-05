import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';

const ping: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(intr) {
        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor).setTitle('Pong!'),
            ],
        });
    },
};

export = ping;