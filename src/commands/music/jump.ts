import errorResponse from '@utils/errorResponse';
import { Player } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function (intr: ChatInputCommandInteraction, player: Player): Promise<void> {
    const track = intr.options.getString('song');
    const number = intr.options.getNumber('number');

    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    if (track) {
        for (const song of queue.tracks) {
            if (song.title == track || song.url == track) {
                // eslint-disable-next-line no-await-in-loop
                await queue.skipTo(song);
                // eslint-disable-next-line no-await-in-loop
                await intr.reply({
                    embeds: [
                        new EmbedBuilder().setColor(embedColor).setTitle(`Skiped to ${track}`),
                    ],
                });
                return;
            }
        }

        await errorResponse(intr, `Couldn't find ${track}... try using the url or the full name of the song`);
        return;
    }

    if (number) {
        const index = number - 1;
        const trackName = queue.tracks[index].title;
        if (!trackName) {
            await errorResponse(intr, 'This track doesn\'t seem to exist');
            return;
        }
        queue.skipTo(index);
        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor).setTitle(`Skiped to ${trackName}`),
            ],
        });
    }
}