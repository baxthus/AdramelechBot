import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

const avatar: Command = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Return the selected user\'s avatar')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('Mention a user'))
        .setDMPermission(false),
    async execute(intr) {
        const target = intr.options.getUser('user') ?? intr.user;

        const png_image = target.avatarURL({ size: 4096, extension: 'png' });
        const jpg_image = target.avatarURL({ size: 4096, extension: 'jpg' });
        const webp_image = target.avatarURL({ size: 4096, extension: 'webp' });

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle(`Avatar for ${target.tag}`)
                    .setDescription(`
                    **Link has**
                    [png](${png_image}) | [jpg](${jpg_image}) | [webp](${webp_image})
                    `)
                    .setImage(target.avatarURL({ size: 1024 })),
            ],
        });
    },
};

export default avatar;