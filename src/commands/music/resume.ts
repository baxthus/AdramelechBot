import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs) {
    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue) {
        await errorResponse(intr, 'There is no music playing');
        return;
    }

    if (!queue?.connection.paused) {
        await errorResponse(intr, 'The music is not paused');
        return;
    }

    const success = queue.setPaused(false);

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(success ? `Current music ${queue.current.title} resumed` : 'Something went wrong'),
        ],
    });
}