import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { embedColor } from '@config';

// This is basically the same as ban.ts
const kick: Command = {
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
    async execute(intr) {
        const user = intr.options.getUser('user', true);
        const member = intr.guild?.members.cache.get(user.id);
        const reason = intr.options.getString('reason') ?? undefined;

        if (member?.id === intr.user.id) {
            await errorResponse(intr, 'You cannot kick yourself');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        if (member?.guild.roles.highest! > intr.guild?.roles.highest!) {
            await errorResponse(intr, 'You cannot kick user who have highest role than you');
            return;
        }

        if (!member?.bannable) {
            await errorResponse(intr, 'I cannot kick that user');
            return;
        }

        member.ban({ reason: reason });

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle('__Adramelech Kick__')
                    .setDescription(`
                User ${user} has been kicked
                Reason: ${reason}
                Author: ${intr.user}
                `),
            ],
        });
    },
};

export = kick;