import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { embedColor } from 'src/config';

type ICat = {
    owner?: string;
    url: string;
}

export = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Return a cat image'),
    async execute(interaction: ChatInputCommandInteraction) {
        const res: ICat = await (await fetch('https://cataas.com/cat?json=true')).json();

        const embed = new EmbedBuilder().setColor(embedColor)
            .setImage(`https://cataas.com/${res.url}`)
            .setFooter({ text: `Owner: ${res.owner}\nPowered by https://cataas.com` });

        await interaction.reply({ embeds: [embed] });
    },
};