import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs): Promise<void> {
    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    if (!queue.tracks[0]) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    queue.clear();

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor).setTitle('The queue has just been cleared'),
        ],
    });
}