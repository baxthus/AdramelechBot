import { SlashCommandBuilder, EmbedBuilder, TextChannel, ChatInputCommandInteraction } from 'discord.js';
import { E6 } from 'furry-wrapper';

export = {
    data: new SlashCommandBuilder()
        .setName('yiff2')
        .setDescription('Return a yiff (furry porn) image (NSFW) (BETA)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Separate categories using space')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        // This is horrible, like commented in nsfw.ts
        if (interaction.channel instanceof TextChannel) {
            if (!interaction.channel.nsfw) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor('Red')
                            .setTitle('__Error!__')
                            .setDescription('Your not in a NSFW channel'),
                    ], ephemeral: true,
                });
            }

            // continue
        } else if (interaction.channel === null) {
            // continue
        } else {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('Your not in a Text or DM channel'),
                ], ephemeral: true,
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const choice: any = interaction.options.getString('category');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let res: any;

        // Try to request
        // Why try? because the user can put a screwed up tag and fuck it all up
        try {
            res = await E6.nsfw(choice);
        } catch {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__'),
                ], ephemeral: true,
            });
        }

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setImage((res).file.url)
            .setFooter({ text: 'Powered by https://e621.net' });

        await interaction.reply({ embeds: [embed] });
    },
};