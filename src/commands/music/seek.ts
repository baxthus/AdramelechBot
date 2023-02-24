import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import ms from 'ms';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs) {
    const queue = player.getQueue(intr.guild ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music is being played');
        return;
    }

    const time = ms(intr.options.getString('time', true));

    if (time >= queue.current.durationMS) {
        await errorResponse(intr, 'Time is greater than the duration of the song');
        return;
    }

    await queue.seek(time);

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(`Time set to ${ms(time, { long: true })}`),
        ],
    });
}