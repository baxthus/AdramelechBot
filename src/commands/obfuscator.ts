import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import config from '../config';

export = {
    data: new SlashCommandBuilder()
        .setName('obfuscator')
        .setDescription('Obfuscate your URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL that you want obfuscate')
                .setRequired(true)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(interaction: ChatInputCommandInteraction) {
        const rawURL = interaction.options.getString('url');

        let url;
        let res;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (rawURL!.startsWith('https://' || 'http://')) ? url = rawURL : url = 'https://' + rawURL;

        const r = await fetch('https://owo.vc/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'link': url, 'generator': 'sketchy', 'preventScrape': true }),
        });

        try {
            res = await r.json();
        } catch {
            return await interaction.reply({ embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('`' + r.statusText + '`'),
            ], ephemeral: true });
        }

        // Sorry, it was the only way I found to give the desired output
        const text = '**Destination:** `' + res.destination + '`\n**Result:** `' + res.result + '`\n**Prevent scrape:** `' + res.preventScrape + '`\n**Owoify:** `' + res.owoify + '`\n**Created at:** `' + res.createdAt + '`';

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle('__Adramelech URL Obfuscator__')
            .setDescription(text)
            .setThumbnail(config.bot.image)
            .setFooter({ text: 'Powered by https://owo.vc' });

        await interaction.reply({ embeds: [embed] });
    },
};