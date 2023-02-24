import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs) {
    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue) {
        await errorResponse(intr, 'There is no music playing');
        return;
    }

    await intr.user.send({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(`:arrow_forward: ${queue.current.title}`)
                .setURL(queue.current.url)
                .setThumbnail(queue.current.thumbnail)
                .addFields(
                    { name: ':hourglass: Duration:', value: `\`${queue.current.duration}\``, inline: true },
                    { name: ':musical_note: Song by:', value: `\`${queue.current.author}\``, inline: true },
                    { name: ':eyes: Views:', value: `\`${queue.current.views.toLocaleString()}\``, inline: true },
                    { name: ':link: Song URL', value: `\`${queue.current.url}\`` }
                )
                .setThumbnail(queue.current.thumbnail)
                .setFooter({ text: `From the server ${intr.guild?.name}`, iconURL: intr.guild?.iconURL() ?? '' }),
        ],
    }).catch(async () => {
        await errorResponse(intr, 'I can\'t send you the current song in DM');
        return;
    });

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle('Sent you the current song in DM'),
        ],
    });
}