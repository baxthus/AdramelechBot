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

    if (!queue.tracks[0]) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    await queue.clear();

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor).setTitle('The queue has just been cleared'),
        ],
    });
}