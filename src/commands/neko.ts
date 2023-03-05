import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';

interface INeko {
    url: string;
}

const neko: Command = {
    data: new SlashCommandBuilder()
        .setName('neko')
        .setDescription('Return a neko image'),
    async execute(intr) {
        const r = await fetch('https://nekos.life/api/v2/img/neko');
        if (r.status !== 200) {
            await errorResponse(intr, 'Something went wrong');
            return;
        }
        const res = await r.json() as INeko;

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(res.url)
                    .setFooter({ text: 'Powered by https://nekos.life' }),
            ],
        });
    },
};

export = neko;