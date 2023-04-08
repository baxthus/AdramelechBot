import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import { botImage, embedColor } from '@config';
import ButtonID from '@interfaces/ButtonID';
import { CustomClient } from 'src/bot';

const help: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help, I need to say more?'),
    async execute(intr) {
        const client = intr.client as CustomClient;

        const commandsInfo: Array<Record<string, string>> = [];

        client.commands.map(command => commandsInfo.push({ [command.data.name]: command.data.description }));

        const longestKey = Math.max(...commandsInfo.map(command => Object.keys(command)[0].length));

        const commandsString = commandsInfo.map(command => `${Object.keys(command)[0].padEnd(longestKey)} - ${Object.values(command)[0]}`);

        let finalString;
        finalString = '=== Commands List ===\n\n';
        finalString += commandsString.join('\n');

        const file = new AttachmentBuilder(Buffer.from(finalString), { name: 'commands.txt' });

        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech Help Page__')
            .setDescription('Commands list has been attached to this message')
            .setThumbnail(botImage)
            .setFooter({ text: 'Created by Abysmal#1608', iconURL: 'https://abysmal.eu.org/avatar.png' });

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Author')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://abysmal.eu.org'),
                new ButtonBuilder()
                    .setLabel('Velocity')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(JSON.stringify({ file: 'speedTest' } as ButtonID)),
            );

        await intr.reply({ embeds: [embed], components: [buttons], files: [file] });
    },
};

export = help;