import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { embedColor } from 'src/config';

export = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Return the selected user\'s avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Mention a user'))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('user') ?? interaction.user;

        const png_image = target?.avatarURL({ size: 4096, extension: 'png' });
        const jpg_image = target?.avatarURL({ size: 4096, extension: 'jpg' });
        const webp_image = target?.avatarURL({ size: 4096, extension: 'webp' });

        await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle(`Avatar for ${target?.tag}`)
                    .setDescription(`
                    **Link has**
                    [png](${png_image}) | [jpg](${jpg_image}) | [webp](${webp_image})
                    `)
                    .setImage(String(target?.avatarURL({ size: 1024 }))),
            ],
        });
    },
};