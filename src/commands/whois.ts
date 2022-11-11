import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';
import config from '../config';

export = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Whois a given domain or IP')
        .addStringOption(option =>
            option.setName('local')
                .setDescription('Domain or IP')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const local = interaction.options.getString('local');

        const res = await (await fetch(`https://da.gd/w/${local}`)).text();

        const errorTest = res.replace('\n', '');
        // That was the best way I found to do it
        if (errorTest.startsWith('Malformed') ||
            errorTest.startsWith('Wrong') ||
            errorTest.startsWith('The queried object does not') ||
            errorTest.startsWith('Invalid') ||
            errorTest.startsWith('No match') ||
            errorTest.startsWith('Domain not') ||
            errorTest.startsWith('NOT FOUND')) {
            return await interaction.reply({ embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__'),
            ], ephemeral: true });
        }

        const file = new AttachmentBuilder(Buffer.from(res), { name: `${local}.txt` });

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setDescription('**Domain/IP:** `' + local + '`')
            .setThumbnail(config.bot.image)
            .setFooter({ text: 'Powered by https://da.gd' });

        await interaction.reply({ embeds: [embed], files: [file] });
    },
};