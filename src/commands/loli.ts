import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import checkNsfwChannel from './utils/checkNsfwChannel';

type IBooru = IBooru2[];
interface IBooru2 {
    file_url: string;
}

export = {
    data: new SlashCommandBuilder()
        .setName('loli')
        .setDescription('Return a loli image (NSFW)'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (checkNsfwChannel(interaction)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('Your not in a NSFW/DM channel'),
                ], ephemeral: true,
            });
        }

        const value = Math.floor(Math.random() * 101);

        const response: IBooru = await (await fetch(`https://lolibooru.moe/post/index.json?tags=nude&limit=${value}`)).json();

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
            .setImage(encodeURI(response[value - 1].file_url))
            .setFooter({ text: 'Powered by https://lolibooru.moe' });

        await interaction.reply({ embeds: [embed] });
    },
};