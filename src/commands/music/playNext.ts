import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { QueryType } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs): Promise<void> {
    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    const song = intr.options.getString('song', true);

    const res = await player.search(song, {
        requestedBy: intr.user,
        searchEngine: QueryType.AUTO,
    });

    if (!res || !res.tracks.length) {
        await errorResponse(intr, 'No results found');
        return;
    }

    if (res.playlist) {
        await errorResponse(intr, 'This command does not support playlists');
        return;
    }

    queue.insert(res.tracks[0], 0);

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle('Track has been added to the queue, it will play next'),
        ],
    });
}