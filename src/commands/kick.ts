import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { embedColor } from 'src/config';

// This is basically the same as ban.ts
export = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason of the kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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
                        .setDescription('You cannot kick yourself'),
                ], ephemeral: true,
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        if (member?.guild.roles.highest! > interaction.guild?.roles.highest!) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('You cannot kick user who have highest role than you'),
                ], ephemeral: true,
            });
        }

        if (!member?.bannable) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('I cannot kick that user'),
                ], ephemeral: true,
            });
        }

        member.ban({ reason: reason });

        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech Kick__')
            .setDescription(`
            User ${user} has been kicked
            Reason: ${reason}
            Author: ${interaction.user}
            `);

        await interaction.reply({ embeds: [embed] });
    },
};