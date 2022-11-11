import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';

export = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Return a dog image'),
    async execute(interaction: ChatInputCommandInteraction) {
        const res = await (await fetch('https://dog.ceo/api/breeds/image/random')).json();

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setImage(res.message)
            .setFooter({ text: 'Powered by https://dog.ceo/api' });

        await interaction.reply({ embeds: [embed] });
    },
};