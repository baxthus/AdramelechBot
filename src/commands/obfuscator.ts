import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import config from '../config';

interface IOwO {
    id: string;
    destination: string;
    preventScrape: boolean;
    owoify: boolean;
    visits: number;
    scrapes: number;
    createdAt: string;
    status: string;
    // most of the time is null
    commentId?: unknown;
    // ///
    result: string;
}

export = {
    data: new SlashCommandBuilder()
        .setName('obfuscator')
        .setDescription('Obfuscate your URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL that you want obfuscate')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const rawURL = interaction.options.getString('url') ?? '';

        let url;

        (rawURL.startsWith('https://' || 'http://')) ? url = rawURL : url = 'https://' + rawURL;

        const r = await fetch('https://owo.vc/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'link': url, 'generator': 'sketchy', 'preventScrape': true }),
        });

        if (r.status !== 200) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription(`\`${r.statusText}\``),
                ],
            });
        }

        const res: IOwO = await r.json();

        const embed = new EmbedBuilder().setColor([203, 166, 247])
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
            .setFooter({ text: 'Powered by https://owo.vc' });

        await interaction.reply({ embeds: [embed] });
    },
};