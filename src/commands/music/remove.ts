import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

// eslint-disable-next-line complexity
export default async function ({ intr, player }: MusicCommandArgs) {
    const track = intr.options.getString('song');
    const number = intr.options.getNumber('number');

    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'There is no music playing');
        return;
    }

    if (!track && !number) {
        await errorResponse(intr, 'You need to specify a song or a number');
        return;
    }

    if (track) {
        for (const song of queue.tracks) {
            if (song.title === track || song.url === track) {
                queue.remove(song);

                // eslint-disable-next-line no-await-in-loop
                await intr.reply({
                    embeds: [
                        new EmbedBuilder().setColor(embedColor)
                            .setTitle(`Removed ${song.title} from the queue`),
                    ],
                });
                return;
            }
        }

        await errorResponse(intr, 'That song does not exist');
        return;
    }

    if (number) {
        const index = number - 1;
        const trackName = queue.tracks[index].title;

        if (!trackName) {
            await errorResponse(intr, 'That song does not exist');
            return;
        }

        queue.remove(index);

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle(`Removed ${trackName} from the queue`),
            ],
        });
    }
}