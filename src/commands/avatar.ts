import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';

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

        const pngImage = target.avatarURL({ size: 4096, extension: 'png' });
        const jpgImage = target.avatarURL({ size: 4096, extension: 'jpg' });
        const webpImage = target.avatarURL({ size: 4096, extension: 'webp' });

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle(`Avatar for ${target.tag}`)
                    .setDescription(`
                    **Link has**
                    [png](${pngImage}) | [jpg](${jpgImage}) | [webp](${webpImage})
                    `)
                    .setImage(target.avatarURL({ size: 1024 })),
            ],
        });
    },
};

export = avatar;