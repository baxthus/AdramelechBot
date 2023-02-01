import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';

interface IDog {
    status: string;
    message: string;
}

export = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Return a dog image'),
    async execute(interaction: ChatInputCommandInteraction) {
        const res: IDog = await (await fetch('https://dog.ceo/api/breeds/image/random')).json();

        if (res.status !== 'success') {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setDescription('__Error!__'),
                ], ephemeral: true,
            });
        }

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setImage(res.message)
            .setFooter({ text: 'Powered by https://dog.ceo/api' });

        await interaction.reply({ embeds: [embed] });
    },
};