import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';
import errorResponse from '@utils/errorResponse';

interface IDog {
    status: string;
    message: string;
}

const dog: Command = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Return a dog image'),
    uses: ['https://dog.ceo/api'],
    async execute(intr) {
        const res: IDog = await (await fetch('https://dog.ceo/api/breeds/image/random')).json();

        if (res.status !== 'success') {
            await errorResponse(intr);
            return;
        }

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(res.message)
                    .setFooter({ text: 'Powered by https://dog.ceo/api' }),
            ],
        });
    },
};

export = dog;