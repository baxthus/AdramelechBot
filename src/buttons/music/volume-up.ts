import ButtonArgs from '@interfaces/ButtonArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import config from 'src/config';

const maxVol = config.bot.music.maxVolume;

export default async function ({ intr, queue }: ButtonArgs): Promise<void> {
    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    const vol = Math.floor(queue.volume + 5);

    if (vol > maxVol) {
        await errorResponse(intr, `Volume cannot be more than ${maxVol}`);
        return;
    }

    if (queue.volume === vol) {
        await errorResponse(intr, 'Volume you want to set is the same as current volume');
        return;
    }

    const success = queue.setVolume(vol);

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(config.bot.embedColor)
                .setTitle(success ? `Volume set to ${vol}` : 'Something went wrong'),
        ],
    });
}