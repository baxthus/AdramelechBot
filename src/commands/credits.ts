import { botImage, embedColor } from '@config';
import Command from '@interfaces/Command';
import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';

const credits: Command = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Credits list'),
    async execute(intr) {
        const commands = fs.readFileSync(__dirname + '/../credits.json');
        const commandsJson: Array<{ [key: string]: string }> = JSON.parse(commands.toString());
        const commandsArray = commandsJson.map((command) => `Command ${Object.keys(command)[0]} uses ${Object.values(command)[0]}`);

        const file = new AttachmentBuilder(Buffer.from(commandsArray.join('\n\n')), { name: 'commands.txt' });

        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech Credits__')
            .setDescription('Credits list has been attached to this message')
            .setThumbnail(botImage)
            .setFooter({ text: 'Created by Abysmal#1608', iconURL: 'https://abysmal.eu.org/avatar.png' });

        await intr.reply({ embeds: [embed], files: [file] });
    },
};

export = credits;