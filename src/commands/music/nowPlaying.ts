import ButtonID from '@interfaces/ButtonID';
import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs): Promise<void> {
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

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .setComponents(
            // save-track
            new ButtonBuilder()
                .setLabel('Save this track')
                .setStyle(ButtonStyle.Danger)
                .setCustomId(JSON.stringify({ file: 'save-track', music: true } as ButtonID)),
            // volume-up
            new ButtonBuilder()
                .setLabel('Volume up')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({ file: 'volume-up', music: true } as ButtonID)),
            // volume-down
            new ButtonBuilder()
                .setLabel('Volume down')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({ file: 'volume-down', music: true } as ButtonID)),
            // loop
            new ButtonBuilder()
                .setLabel('Loop')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({ file: 'loop', music: true } as ButtonID)),
            // resume-pause
            new ButtonBuilder()
                .setLabel('Resume/Pause')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({ file: 'resume-pause', music: true } as ButtonID)),
        );

    intr.reply({ embeds: [embed], components: [buttons] });
}