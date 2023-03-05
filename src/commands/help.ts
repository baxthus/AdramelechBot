import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import { botImage, embedColor } from 'src/config';
import fs from 'node:fs';
import ButtonID from '@interfaces/ButtonID';

const help: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help, I need to say more?'),
    async execute(intr) {
        const commands = fs.readFileSync(__dirname + '/../commands.json');
        const commandsJson: Array<{ [key: string]: string }> = JSON.parse(commands.toString());
        const commandsArray = commandsJson.map((command) => `/${Object.keys(command)[0]} - ${Object.values(command)[0]}`);

        const file = new AttachmentBuilder(Buffer.from(commandsArray.join('\n\n')), { name: 'commands.txt' });

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