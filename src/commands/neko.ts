import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import nekos from 'nekos.life';
import { embedColor } from 'src/config';

const neko = new nekos();

export = {
    data: new SlashCommandBuilder()
        .setName('neko')
        .setDescription('Return a neko image'),
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(embedColor)
            .setImage((await neko.neko()).url)
            .setFooter({ text: 'Powered by https://nekos.life' });

        await interaction.reply({ embeds: [embed] });
    },
};