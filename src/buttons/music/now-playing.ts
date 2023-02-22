import MusicButtonArgs from '@interfaces/MusicButtonArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, queue }: MusicButtonArgs): Promise<void> {
    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    const track = queue.current;
    const timestamp = queue.getPlayerTimestamp();
    const trackDuration = timestamp.progress === Infinity ? 'Infinity (live)' : track.duration;
    const progress = queue.createProgressBar();

    const methods = ['disabled', 'track', 'queue'];

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setAuthor({ name: track.title, iconURL: intr.user.avatarURL({ size: 1024 }) ?? '' })
                .setThumbnail(track.thumbnail)
                .setDescription(`
                Volume: **${queue.volume}**\n
                Duration: **${trackDuration}**\n
                Progress: **${progress}**\n
                Loop mode: **${methods[queue.repeatMode]}**\n
                Requested by: **${track.requestedBy}**\n
                `)
                .setTimestamp(),
        ],
    });
}