import errorResponse from '@utils/errorResponse';
import { Player } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function (intr: ChatInputCommandInteraction, player: Player): Promise<void> {
    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    const methods: Array<string> = ['disable', 'track', 'queue'];

    const track = queue.current;
    const timestamp = queue.getPlayerTimestamp();
    const trackDuration = timestamp.progress === Infinity ? 'Infinity (live)' : track.duration;
    const progress = queue.createProgressBar();

    const embed = new EmbedBuilder().setColor(embedColor)
        .setAuthor({ name: track.title, iconURL: intr.user.avatarURL({ size: 1024 }) ?? '', url: track.url })
        .setThumbnail(track.thumbnail)
        .setDescription(`
        Volume: **${queue.volume}**\n
        Duration: **${trackDuration}**\n
        Progress: **${progress}**\n
        Loop mode: **${methods[queue.repeatMode]}**\n
        Requested by: **${track.requestedBy}**\n
        `)
        .setTimestamp();
}