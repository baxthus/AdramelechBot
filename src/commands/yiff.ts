import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import isChannelNsfw from '@utils/isChannelNsfw';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';

interface IYiff {
    images: Array<{
        url: string;
        artists: Array<string>;
    }>
}

const yiff: Command = {
    data: new SlashCommandBuilder()
        .setName('yiff')
        .setDescription('Return a yiff (furry porn) image (NSFW)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Select the category')
                .setRequired(true)
                .addChoices(
                    { name: 'Straight', value: 'straight' },
                    { name: 'Gay', value: 'gay' },
                    { name: 'Lesbian', value: 'lesbian' },
                    { name: 'Gynomorph', value: 'gynomorph' },
                    { name: 'Andromorph', value: 'andromorph' },
                )),
    uses: ['https://yiff.rest'],
    async execute(intr) {
        if (!isChannelNsfw(intr)) {
            await errorResponse(intr, 'Your not in a NSFW/DM channel');
            return;
        }

        const category = intr.options.getString('category', true);

        const r = await fetch(`https://v2.yiff.rest/furry/yiff/${category}?notes=disabled`, {
            headers: {
                // this is not ethical. too bad.
                'User-Agent': 'curl',
            },
        });
        if (r.status !== 200) {
            await errorResponse(intr, 'Something went wrong');
            return;
        }
        const res = await r.json() as IYiff;

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(res.images[0].url)
                    .setFooter({ text: `Artists: ${res.images[0].artists.join(', ')}\nPowered by https://yiff.rest` }),
            ],
        });
    },
};

export = yiff;