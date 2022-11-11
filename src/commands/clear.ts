import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export ={
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(interaction: any) {
        const amount = interaction.options.getInteger('amount');

        await interaction.channel.bulkDelete(amount);

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle('__Adramelech Clear__')
            .setDescription(`
            Successfully deleted ${amount} messages
            Command executed by ${interaction.user}
            `);

        await interaction.reply({ embeds: [embed] }).then(() => {
            setTimeout(() => interaction.deleteReply(), 5000);
        });
    },
};