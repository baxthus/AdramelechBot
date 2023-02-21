import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import isChannelNsfw from '@utils/isChannelNsfw';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

interface INsfw {
    url: string;
}

const nsfw: Command = {
    data: new SlashCommandBuilder()
        .setName('nsfw')
        .setDescription('Return a NSFW image (NSFW)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Select the category')
                .setRequired(true)
                .addChoices(
                    // cspell: disable-next
                    { name: 'Waifu', value: 'waifu' },
                    { name: 'Neko', value: 'neko' },
                    { name: 'Trap', value: 'trap' },
                    { name: 'Blowjob', value: 'blowjob' }
                )),
    async execute(intr) {
        if (!isChannelNsfw(intr)) {
            await errorResponse(intr, 'Your not in a NSFW/DM channel');
            return;
        }

        const choice = intr.options.getString('category');

        const res: INsfw = await (await fetch(`https://api.waifu.pics/nsfw/${choice}`)).json();


        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(res.url)
                    .setFooter({ text: 'Powered by https://waifu.pics' }),
            ],
        });
    },
};

export default nsfw;