import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';
import errorResponse from '@utils/errorResponse';

interface ICat {
    owner?: string;
    url: string;
}

const cat: Command = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Return a cat image'),
    uses: ['https://cataas.com'],
    async execute(intr) {
        const r = await fetch('https://cataas.com/cat?json=true');
        if (r.status !== 200) {
            errorResponse(intr, 'Something went wrong');
            return;
        }
        const res = await r.json() as ICat;

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(`https://cataas.com/${res.url}`)
                    .setFooter({ text: `Owner: ${res.owner}\nPowered by https://cataas.com` }),
            ],
        });
    },
};

export = cat;