import { SlashCommandBuilder, EmbedBuilder, TextChannel, ChatInputCommandInteraction } from 'discord.js';

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
        // This is a horrible way to check the channel type, but works
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
                    .setDescription('Your not in a Text or DM Channel'),
            ], ephemeral: true });
        }

        const choice = interaction.options.getString('category');

        const res = await (await fetch(`https://api.waifu.pics/nsfw/${choice}`)).json();

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setImage(res.url)
            .setFooter({ text: 'Powered by https://waifu.pics' });

        await interaction.reply({ embeds: [embed] });
    },
};