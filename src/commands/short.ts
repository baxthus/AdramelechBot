import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';

export = {
    data: new SlashCommandBuilder()
        .setName('short')
        .setDescription('Short your URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL that you want to short')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const url = interaction.options.getString('url');

        const res = await (await fetch(`https://is.gd/create.php?format=simple&url=${url}`)).text();

        if (res.startsWith('Error')) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('`' + res + '`'),
                ], ephemeral: true,
            });
        }

        const embed = new EmbedBuilder().setColor([203, 166, 247])
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
            .setFooter({ text: 'Powered by https://is.gd' });

        await interaction.reply({ embeds: [embed] });
    },
};