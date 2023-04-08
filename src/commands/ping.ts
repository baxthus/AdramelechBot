import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import { embedColor } from '@config';
import { ButtonStyle } from 'discord.js';
import ButtonID from '@interfaces/ButtonID';

const ping: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(intr) {
        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Author')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://abysmal.eu.org'),
                new ButtonBuilder()
                    .setLabel('Velocity')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(JSON.stringify({ file: 'speedTest' } as ButtonID))
            );

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor).setTitle('Pong!'),
            ],
            components: [buttons],
        });
    },
};

export = ping;