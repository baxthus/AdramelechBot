import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs) {
    const queue = player.getQueue(intr.guild ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music is being played');
        return;
    }

    queue.destroy();

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle('Stopped the music'),
        ],
    });
}