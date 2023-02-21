import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import nekosLife from 'nekos.life';
import { embedColor } from 'src/config';

const nekos = new nekosLife();

const neko: Command = {
    data: new SlashCommandBuilder()
        .setName('neko')
        .setDescription('Return a neko image'),
    async execute(intr) {
        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setImage((await nekos.neko()).url)
                    .setFooter({ text: 'Powered by https://nekos.life' }),
            ],
        });
    },
};

export default neko;