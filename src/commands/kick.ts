import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';

// This is basically the same as ban.ts
export = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member')
        .addMentionableOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason of the kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(interaction: any) {
        const user: GuildMember = interaction.options.getMentionable('user');
        const reason = interaction.options.getString('reason') ?? undefined;

        if (user.id === interaction.user.id) {
            return interaction.reply({ embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('You cannot kick yourself'),
            ], ephemeral: true });
        }

        if (user.roles.highest > interaction.guild?.roles.highest) {
            return interaction.reply({ embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('You cannot kick user who have highest role than you'),
            ], ephemeral: true });
        }

        if (!user.bannable) {
            return interaction.reply({ embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('I cannot kick that user'),
            ], ephemeral: true });
        }

        user.ban({ reason: reason });

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle('__Adramelech Kick__')
            .setDescription(`
            User ${user} has been kicked
            Reason: ${reason}
            Author: ${interaction.user}
            `);

        await interaction.reply({ embeds: [embed] });
    },
};