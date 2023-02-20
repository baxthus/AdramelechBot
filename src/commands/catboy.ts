import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import catboysF from 'catboys';
import { embedColor } from 'src/config';
import Command from '@interfaces/Command';

const catboys = new catboysF();

const catboy: Command = {
    data: new SlashCommandBuilder()
        .setName('catboy')
        .setDescription('Return a catboy image (SFW)'),
    async execute(intr) {
        const image = await catboys.image();

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage(image.url)
                    .setFooter({ text: `Artist: ${image.artist}\nPowered by https://catboys.com` }),
            ],
        });
    },
};

export default catboy;