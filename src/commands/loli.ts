import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';
import isChannelNsfw from '@utils/isChannelNsfw';

type Booru = Array<{
    file_url: string;
}>

const loli: Command = {
    data: new SlashCommandBuilder()
        .setName('loli')
        .setDescription('Return a loli image (NSFW)'),
    async execute(intr) {
        if (!isChannelNsfw(intr)) {
            await errorResponse(intr, 'Your not in a NSFW/DM channel');
            return;
        }

        const value = Math.floor(Math.random() * 101);

        const response: Booru = await (await fetch(`https://lolibooru.moe/post/index.json?tags=nude&limit=${value}`)).json();

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
                    .setImage(encodeURI(response[value - 1].file_url))
                    .setFooter({ text: 'Powered by https://lolibooru.moe' }),
            ],
        });
    },
};

export = loli;