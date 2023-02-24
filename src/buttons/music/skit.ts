import MusicButtonArgs from '@interfaces/MusicButtonArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, queue }: MusicButtonArgs): Promise<void> {
    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    const success = queue.skip();

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(success ? `Currently music ${queue.current.title} skipped` : 'Something went wrong'),
        ],
    });
}