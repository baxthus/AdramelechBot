import { SlashCommandBuilder, EmbedBuilder, TextChannel, ChatInputCommandInteraction } from 'discord.js';

export = {
    data: new SlashCommandBuilder()
        .setName('loli')
        .setDescription('Return a loli image (NSFW)'),
    async execute(interaction: ChatInputCommandInteraction) {
        // This is horrible, like commented in nsfw.ts
        if (interaction.channel instanceof TextChannel) {
            if (!interaction.channel.nsfw) {
                return await interaction.reply({ embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('Your not in a NSFW channel'),
                ], ephemeral: true });
            }

            // continue
        } else if (interaction.channel === null) {
            // continue
        } else {
            return await interaction.reply({ embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('Your not in a Text or DM channel'),
            ], ephemeral: true });
        }

        const value = Math.floor(Math.random() * 101);

        const response = await (await fetch(`https://lolibooru.moe/post/index.json?tags=nude&limit=${value}`)).json();

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
            .setImage(encodeURI(response[value - 1].file_url))
            .setFooter({ text: 'Powered by https://lolibooru.moe' });

        await interaction.reply({ embeds: [embed] });
    },
};