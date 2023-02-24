import MusicButtonArgs from '@interfaces/MusicButtonArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, queue }: MusicButtonArgs): Promise<void> {
    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    intr.user.send({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(`:arrow_forward: ${queue.current.title}`)
                .setURL(queue.current.url)
                .addFields(
                    { name: ':hourglass: Duration:', value: `\`${queue.current.duration}\``, inline: true },
                    { name: 'Song by:', value: `\`${queue.current.author}\``, inline: true },
                    { name: ':eyes: Views:', value: `\`${Number(queue.current.views).toLocaleString()}\``, inline: true },
                    { name: 'Song URL:', value: `\`${queue.current.url}\`` }
                )
                .setThumbnail(queue.current.thumbnail)
                .setFooter({ text: `From the server ${intr.guild?.id}`, iconURL: intr.guild?.iconURL() ?? '' }),
        ],
    }).then(() => {
        intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle('Track info sent to your DM!'),
            ],
        });
    }).catch(() => {
        intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle('Unable to send you a DM!'),
            ],
        });
    });
}