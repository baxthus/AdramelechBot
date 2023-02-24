import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { QueryType } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import config from 'src/config';

// eslint-disable-next-line complexity
export default async function ({ intr, player }: MusicCommandArgs): Promise<void> {
    const song = intr.options.getString('song', true);
    const res = await player.search(song, {
        requestedBy: intr.user,
        searchEngine: QueryType.AUTO,
    });

    if (!res || !res.tracks.length) {
        await errorResponse(intr, 'No results found');
        return;
    }

    const queue = player.createQueue(intr.guild ?? '', {
        metadata: intr.channel,
        spotifyBridge: true,
        initialVolume: config.bot.music.maxVolume,
        leaveOnEnd: true,
    });

    try {
        const member = intr.guild?.members.cache.get(intr.user.id);
        if (!queue.connection) await queue.connect(member?.voice.channel ?? '');
    } catch {
        player.deleteQueue(intr.guildId ?? '');
        errorResponse(intr, 'Could not join your voice channel');
        return;
    }

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(config.bot.embedColor)
                .setTitle(`Loading your ${res.playlist ? 'playlist' : 'track'}`),
        ],
    });

    res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

    if (!queue.playing) await queue.play();
}