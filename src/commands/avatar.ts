import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';

export = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        // eslint-disable-next-line quotes
        .setDescription("Return the selected user's avatar")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Mention a user')
                .setRequired(true))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('user');

        interaction.reply({ embeds: [
            new EmbedBuilder().setColor([203, 166, 247])
                .setImage(target?.avatarURL() + '?size=1024'),
        ] });
    },
};