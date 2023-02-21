import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

const short: Command = {
    data: new SlashCommandBuilder()
        .setName('short')
        .setDescription('Short your URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL that you want to short')
                .setRequired(true)),
    async execute(intr) {
        const url = intr.options.getString('url');

        const res = await (await fetch(`https://is.gd/create.php?format=simple&url=${url}`)).text();

        if (res.replace('\n', '').startsWith('Error')) {
            await errorResponse(intr, `\`${res}\``);
            return;
        }

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle('__Adramelech URL Shortener__')
                    .addFields(
                        {
                            name: ':outbox_tray: **URL**',
                            value: `\`\`\`${url}\`\`\``,
                        },
                        {
                            name: ':inbox_tray: **Result**',
                            value: `\`\`\`${res}\`\`\``,
                        }
                    )
                    .setFooter({ text: 'Powered by https://is.gd' }),
            ],
        });
    },
};

export default short;