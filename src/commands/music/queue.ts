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

    if (!queue.tracks[0]) {
        await errorResponse(intr, 'No music in queue after the current one');
        return;
    }

    const methods: Array<string> = ['', '🔁', '🔂'];

    const songs = queue.tracks.length;
    const nextSongs = songs > 5 ? `And **${songs - 5}** other songs...` : `In the queue: **${songs}** song(s)`;

    const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by ${track.requestedBy.username})`);

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setThumbnail(intr.guild?.iconURL({ size: 2048 }) ?? '')
                .setAuthor({
                    name: `Server queue - ${intr.guild?.name} ${methods[queue.repeatMode]}`,
                    iconURL: intr.client.user.displayAvatarURL({ size: 1024 }),
                })
                .setDescription(`
                Current ${queue.current.title}\n
                ${tracks.slice(0, 5).join('\n')}\n
                ${nextSongs}
                `)
                .setTimestamp(),
        ],
    });
}