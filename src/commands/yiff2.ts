import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { E6 } from 'furry-wrapper';
import checkNsfwChannel from './utils/checkNsfwChannel';

export = {
    data: new SlashCommandBuilder()
        .setName('yiff2')
        .setDescription('Return a yiff (furry porn) image (NSFW) (BETA)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Separate categories using space')
                .setRequired(true)),
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const choice: any = interaction.options.getString('category');
        let img;

        // Try to request
        // Why try? because the user can put a screwed up tag and fuck it all up
        try {
            // this is a horrible way of doing this,
            // but is the only way I could get it to work
            await E6.nsfw(choice).then(res => {
                img = JSON.parse(JSON.stringify(res));
            });
        } catch {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__'),
                ], ephemeral: true,
            });
        }

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setImage(String(img))
            .setFooter({ text: 'Powered by https://e621.net' });

        await interaction.reply({ embeds: [embed] });
    },
};