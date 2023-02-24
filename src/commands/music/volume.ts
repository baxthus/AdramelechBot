import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs) {
    const queue = player.getQueue(intr.guild ?? '');

    if (!queue) {
        await errorResponse(intr, 'No music is being played');
        return;
    }

    const volume = intr.options.getNumber('volume', true);

    if (queue.volume === volume) {
        await errorResponse(intr, `The volume is already ${volume}`);
        return;
    }

    const success = queue.setVolume(volume);

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(success ? `Set the volume to ${volume}` : 'Something went wrong'),
        ],
    });
}