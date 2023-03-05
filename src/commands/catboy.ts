import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';
import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';

interface ICatboy {
    url: string;
    artist: string;
}

const catboy: Command = {
    data: new SlashCommandBuilder()
        .setName('catboy')
        .setDescription('Return a catboy image (SFW)'),
    async execute(intr) {
        const r = await fetch('https://api.catboys.com/img');
        if (r.status !== 200) {
            await errorResponse(intr, 'Something went wrong');
            return;
        }
        const res = await r.json() as ICatboy;

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(res.url)
                    .setFooter({ text: `Artist: ${res.artist}\nPowered by https://catboys.com` }),
            ],
        });
    },
};

export = catboy;