import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { QueueRepeatMode } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs): Promise<void> {
    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    let success = false;

    switch (intr.options.getString('action')) {
        case 'enable_loop_queue':
            if (queue.repeatMode === QueueRepeatMode.TRACK) {
                await errorResponse(intr, 'You must first disable the song loop (/music loop Disable)');
                return;
            }

            success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
            break;
        case 'enable_loop_song':
            if (queue.repeatMode === QueueRepeatMode.QUEUE) {
                await errorResponse(intr, 'You must first disable the queue loop (/music loop Disable)');
                return;
            }

            success = queue.setRepeatMode(QueueRepeatMode.TRACK);
            break;
        case 'disable_loop':
            success = queue.setRepeatMode(QueueRepeatMode.OFF);
            break;
    }

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(success ? 'Repeat mode **enabled**' : 'Something went wrong'),
        ],
    });
}