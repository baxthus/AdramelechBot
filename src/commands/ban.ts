import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { embedColor } from 'src/config';

export = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason of the ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild?.members.cache.get(user?.id ?? '');
        const reason = interaction.options.getString('reason') ?? undefined;

        if (member?.id === interaction.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('You cannot ban yourself'),
                ], ephemeral: true,
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        if (member?.guild.roles.highest! > interaction.guild?.roles.highest!) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('You cannot ban user who have highest role than you'),
                ], ephemeral: true,
            });
        }

        if (!member?.bannable) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('I cannot ban that user'),
                ], ephemeral: true,
            });
        }

        member?.ban({ reason: reason });

        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech Ban__')
            .setDescription(`
            User ${user} has been banned
            Reason: ${reason}
            Author: ${interaction.user}
            `);

        await interaction.reply({ embeds: [embed] });
    },
};