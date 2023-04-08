import { botImage, embedColor } from '@config';
import Command from '@interfaces/Command';
import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from 'src/bot';

const credits: Command = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Credits list'),
    async execute(intr) {
        const client = intr.client as CustomClient;

        const commandsInfo: Array<Record<string, string>> = [];

        client.commands.map(command => {
            if (command.uses) {
                commandsInfo.push({ [command.data.name]: command.uses.join(', ') });
            }
        });

        const longestKey = Math.max(...commandsInfo.map(command => Object.keys(command)[0].length));

        const commandsString = commandsInfo.map(command => `${Object.keys(command)[0].padEnd(longestKey)} uses ${Object.values(command)}`);

        let finalString;
        finalString = '=== Credits List ===\n\n';
        finalString += commandsString.join('\n');

        const file = new AttachmentBuilder(Buffer.from(finalString), { name: 'commands.txt' });

        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech Credits__')
            .setDescription('Credits list has been attached to this message')
            .setThumbnail(botImage)
            .setFooter({ text: 'Created by Abysmal#1608', iconURL: 'https://abysmal.eu.org/avatar.png' });

        await intr.reply({ embeds: [embed], files: [file] });
    },
};

export = credits;