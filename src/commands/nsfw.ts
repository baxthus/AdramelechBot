import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { embedColor } from 'src/config';
import checkNsfwChannel from './utils/checkNsfwChannel';

export = {
    data: new SlashCommandBuilder()
        .setName('nsfw')
        .setDescription('Return a NSFW image (NSFW)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Select the category')
                .setRequired(true)
                .addChoices(
                    { name: 'Waifu', value: 'waifu' },
                    { name: 'Neko', value: 'neko' },
                    { name: 'Trap', value: 'trap' },
                    { name: 'Blowjob', value: 'blowjob' }
                )),
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

        const choice = interaction.options.getString('category');

        const res = await (await fetch(`https://api.waifu.pics/nsfw/${choice}`)).json();

        const embed = new EmbedBuilder().setColor(embedColor)
            .setImage(res.url)
            .setFooter({ text: 'Powered by https://waifu.pics' });

        await interaction.reply({ embeds: [embed] });
    },
};