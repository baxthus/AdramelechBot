import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { QueryType } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs) {
    const song = intr.options.getString('song', true);

    const res = await player.search(song, {
        requestedBy: intr.user,
        searchEngine: QueryType.AUTO,
    });

    if (!res || !res.tracks.length) {
        await errorResponse(intr, 'No results found');
        return;
    }

    const queue = await player.createQueue(intr.guild ?? '', {
        metadata: intr.channel,
        leaveOnEnd: true,
    });
    const maxTracks = res.tracks.slice(0, 10);

    intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setAuthor({ name: `Results for ${song}`, iconURL: intr.client.user.displayAvatarURL({ size: 1024 }) })
                .setDescription(`
                ${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n
                Select the choice between **1** and **${maxTracks.length}** or **cancel**
                `),
        ],
    });

    const collector = intr.channel?.createMessageCollector({
        time: 15000,
        max: 1,
        filter: m => m.author.id === intr.user.id,
    });

    collector?.on('collect', async (message) => {
        if (message.content.toLowerCase() === 'cancel') {
            await intr.followUp({
                embeds: [
                    new EmbedBuilder().setColor(embedColor)
                        .setTitle('Search cancelled'),
                ], ephemeral: true,
            });
            return;
        }

        const value = parseInt(message.content);
        if (!value || value <= 0 || value > maxTracks.length) {
            await intr.followUp({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('Invalid value'),
                ], ephemeral: true,
            });
            return;
        }

        collector.stop();

        try {
            const member = intr.guild?.members.cache.get(intr.user.id);
            if (!queue.connection) await queue.connect(member?.voice.channel ?? '');
        } catch {
            player.deleteQueue(intr.guildId ?? '');
            await intr.followUp({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('Could not join your voice channel'),
                ], ephemeral: true,
            });
            return;
        }

        queue.addTrack(res.tracks[value - 1]);

        await intr.followUp({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle('Added to queue'),
            ],
        });

        if (!queue.playing) await queue.play();
    });

    collector?.on('end', async (message, reason) => {
        if (reason === 'time') {
            await intr.followUp({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('Search timed out'),
                ], ephemeral: true,
            });
        }
    });
}