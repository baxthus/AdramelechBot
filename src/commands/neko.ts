import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import nekos from 'nekos.life';

const neko = new nekos();

export = {
    data: new SlashCommandBuilder()
        .setName('neko')
        .setDescription('Return a neko image'),
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setImage((await neko.neko()).url)
            .setFooter({ text: 'Powered by https://nekos.life' });

        await interaction.reply({ embeds: [embed] });
    },
};