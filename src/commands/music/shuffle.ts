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

    if (!queue.tracks[0]) {
        await errorResponse(intr, 'No songs in the queue');
        return;
    }

    queue.shuffle();

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(`Shuffled ${queue.tracks.length} songs`),
        ],
    });
}