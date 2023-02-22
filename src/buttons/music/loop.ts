import MusicButtonArgs from '@interfaces/MusicButtonArgs';
import errorResponse from '@utils/errorResponse';
import { QueueRepeatMode } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, queue }: MusicButtonArgs): Promise<void> {
    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    switch (queue.repeatMode) {
        case (QueueRepeatMode.OFF):
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            break;
        case (QueueRepeatMode.TRACK):
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            break;
        case (QueueRepeatMode.QUEUE):
            queue.setRepeatMode(QueueRepeatMode.OFF);
            break;
    }

    const methods = ['disabled', 'track', 'queue'];

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor).setTitle(`Loop has been set to ${methods[queue.repeatMode]}`),
        ],
    });
}