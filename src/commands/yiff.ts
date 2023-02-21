import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import isChannelNsfw from '@utils/isChannelNsfw';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';
import Yiffy, { JSONResponse } from 'yiffy';

const yiffF = new Yiffy();

const category_list: { [key: string]: Promise<JSONResponse> } = {
    'straight': yiffF.images.furry.yiff.straight(),
    'gay': yiffF.images.furry.yiff.gay(),
    'lesbian': yiffF.images.furry.yiff.lesbian(),
    'gynomorph': yiffF.images.furry.yiff.gynomorph(),
    'andromorph': yiffF.images.furry.yiff.andromorph(),
};

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
    async execute(intr) {
        if (!isChannelNsfw(intr)) {
            await errorResponse(intr, 'Your not in a NSFW/DM channel');
            return;
        }

        const choice = intr.options.getString('category') ?? '';
        let img: JSONResponse;

        // Check if this shit is being rate limited
        // This will be bad if a lot of people use this command
        // Sounds like a big load of not my problem
        try {
            img = await category_list[choice];
        } catch {
            await errorResponse(intr, 'We are being rate limited, sorry for the inconvenience');
            return;
        }

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(img.url)
                    .setFooter({ text: `Artists: ${img.artists.join(', ')}\nPowered by https://yiff.rest` }),
            ],
        });
    },
};

export = yiff;