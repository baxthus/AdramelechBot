import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { embedColor } from 'src/config';

export = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor).setTitle('Pong!'),
            ],
        });
    },
};