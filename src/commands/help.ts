import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import { botImage, embedColor } from 'src/config';
import fs from 'node:fs';

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
                    .setCustomId('velocityButton'),
            );

        const buttons_end = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Author')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://abysmal.eu.org'),
                new ButtonBuilder()
                    .setLabel('Velocity')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('velocityButton')
                    .setDisabled(true),
            );

        await intr.reply({ embeds: [embed], components: [buttons], files: [file] });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter = (i: any) => i.customId === 'velocityButton' && i.user.id === intr.user.id;
        const collector = intr.channel?.createMessageComponentCollector({ filter, time: 15000 });

        collector?.on('collect', async (i) => {
            // This is not the correct way to do it. Too bad.
            const startTime = performance.now();
            fetch('https://discord.com/api/v6');
            const endTime = performance.now();

            // https://stackoverflow.com/a/50075070
            const responseTime = String(endTime - startTime).replace(/\.(\d{1,2}).*$/, '.$1');

            const velocityEmbed = new EmbedBuilder().setColor([203, 166, 247])
                .setTitle('__Adramelech Velocity Test__')
                .setDescription(`Response time from our servers to Discord Endpoint is ${responseTime}ms`);

            await i.update({ embeds: [velocityEmbed] });
            return;
        });

        collector?.on('end', async () => {
            await intr.editReply({ embeds: [embed], components: [buttons_end] });
            return;
        });
    },
};

export = help;