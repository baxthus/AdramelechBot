import ButtonArgs from '@interfaces/ButtonArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, queue }: ButtonArgs): Promise<void> {
    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    const success = queue.setPaused(false);

    if (!success) queue.setPaused(true);

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(`Currently music ${queue.current.title} ${success ? 'paused' : 'resumed'}`),
        ],
    });
}