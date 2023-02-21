import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import config from '../config';

interface IOwO {
    destination: string;
    preventScrape: boolean;
    owoify: boolean;
    createdAt: string;
    result: string;
}

const obfuscator: Command = {
    data: new SlashCommandBuilder()
        .setName('obfuscator')
        .setDescription('Obfuscate your URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL that you want obfuscate')
                .setRequired(true)),
    async execute(intr) {
        const rawURL = intr.options.getString('url') ?? '';

        let url: string;

        (rawURL.startsWith('https://' || 'http://')) ? url = rawURL : url = 'https://' + rawURL;

        const r = await fetch('https://owo.vc/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'link': url, 'generator': 'sketchy', 'preventScrape': true }),
        });

        if (r.status !== 200) {
            await errorResponse(intr, `\`${r.statusText}\``);
            return;
        }

        const res: IOwO = await r.json();

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(config.bot.embedColor)
                    .setTitle('__Adramelech URL Obfuscator__')
                    .setThumbnail(config.bot.image)
                    .addFields(
                        {
                            name: ':outbox_tray: **Destination**',
                            value: `\`\`\`${res.destination}\`\`\``,
                        },
                        {
                            name: ':inbox_tray: **Result**',
                            value: `\`\`\`${res.result}\`\`\``,
                        },
                        {
                            name: ':information_source: **Prevent scrape**',
                            value: `\`\`\`${res.preventScrape}\`\`\``,
                        },
                        {
                            name: ':smiling_imp: **Owoify**',
                            value: `\`\`\`${res.owoify}\`\`\``,
                        },
                        {
                            name: ':clock1: **Created at**',
                            value: `\`\`\`${res.createdAt}\`\`\``,
                        }
                    )
                    .setFooter({ text: 'Powered by https://owo.vc' }),
            ],
        });
    },
};

export default obfuscator;