import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import catboys from 'catboys';
import { embedColor } from 'src/config';

const catboy = new catboys();

export = {
    data: new SlashCommandBuilder()
        .setName('catboy')
        .setDescription('Return a catboy image (SFW)'),
    async execute(interaction: ChatInputCommandInteraction) {
        const image = await catboy.image();

        const embed = new EmbedBuilder().setColor(embedColor)
            .setImage(image.url)
            .setFooter({
                text: `Artist: ${image.artist}\nPowered by https://catboys.com`,
            });

        await interaction.reply({ embeds: [embed] });
    },
};