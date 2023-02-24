import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs): Promise<void> {
    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    if (queue.connection.paused) {
        await errorResponse(intr, 'The music is already paused');
        return;
    }

    const success = queue.setPaused(true);

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(success ? `Currently music ${queue.current.title} paused` : 'Something went wrong'),
        ],
    });
}