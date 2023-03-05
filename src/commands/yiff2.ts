import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { E6 } from 'furry-wrapper';
import { embedColor } from '@config';
import isChannelNsfw from '@utils/isChannelNsfw';
import errorResponse from '@utils/errorResponse';

interface IYiff {
    file: {
        url: string;
    };
    tags: {
        artist: Array<string>;
    };
}

const yiff: Command = {
    data: new SlashCommandBuilder()
        .setName('yiff2')
        .setDescription('Return a yiff (furry porn) image (NSFW) (BETA)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Separate categories using space')
                .setRequired(true)),
    async execute(intr) {
        if (!isChannelNsfw(intr)) {
            await errorResponse(intr, 'Your not in a NSFW/DM channel');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const choice: any = intr.options.getString('category', true);
        let img: IYiff = JSON.parse('cock');

        // Try to request
        // Why try? because the user can put a screwed up tag and fuck it all up
        try {
            // this is a horrible way of doing this,
            // but is the only way I could get it to work
            await E6.nsfw(choice).then(res => {
                img = JSON.parse(JSON.stringify(res));
            });
        } catch {
            await errorResponse(intr);
            return;
        }

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(img.file.url)
                    .setFooter({ text: `Artists: ${img.tags.artist.join(', ')}\nPowered by https://e621.net` }),
            ],
        });
    },
};

export = yiff;