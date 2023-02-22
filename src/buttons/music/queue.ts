import MusicButtonArgs from '@interfaces/MusicButtonArgs';
import errorResponse from '@utils/errorResponse';

export default async function ({ intr, queue }: MusicButtonArgs): Promise<void> {
    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    if (!queue.tracks[0]) {
        await errorResponse(intr, 'There is no music in the queue');
        return;
    }

    const methods = ['', '🔁', '🔂'];

    const songs = queue.tracks.length;

    const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)` : `In the playlist **${songs}** song(s)`;

    const tracks = queue.tracks.map((track, i) => `**${i + 1}.** ${track.title} | ${track.author} (requested by ${track.requestedBy.username})`);
}