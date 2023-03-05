import ButtonArgs from '@interfaces/ButtonArgs';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, queue }: ButtonArgs): Promise<void> {
    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    await intr.user.send({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle(`:arrow_forward: ${queue.current.title}`)
                .setURL(queue.current.url)
                .addFields(
                    { name: ':hourglass: Duration:', value: `\`${queue.current.duration}\``, inline: true },
                    { name: ':musical_note: Song by:', value: `\`${queue.current.author}\``, inline: true },
                    { name: ':eyes: Views:', value: `\`${Number(queue.current.views).toLocaleString()}\``, inline: true },
                    { name: ':link: Song URL:', value: `\`${queue.current.url}\`` }
                )
                .setThumbnail(queue.current.thumbnail)
                .setFooter({ text: `From the server ${intr.guild?.id}`, iconURL: intr.guild?.iconURL() ?? '' }),
        ],
    }).catch(async () => {
        await errorResponse(intr, 'Unable to send you a DM!');
        return;
    });

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor)
                .setTitle('Track info sent to your DM!'),
        ],
    });
}