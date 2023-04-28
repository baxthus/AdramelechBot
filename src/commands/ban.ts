import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { embedColor } from '@config';
import errorResponse from '@utils/errorResponse';

const ban: Command = {
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
    async execute(intr) {
        const user = intr.options.getUser('user', true);
        const member = intr.guild?.members.cache.get(user.id);
        const reason = intr.options.getString('reason') ?? undefined;

        if (member?.id === intr.user.id) {
            await errorResponse(intr, 'You cannot ban yourself');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        if (member?.guild.roles.highest! > intr.guild?.roles.highest!) {
            await errorResponse(intr, 'You cannot ban a user who have highest role than you');
            return;
        }

        if (!member?.bannable) {
            await errorResponse(intr, 'I cannot ban that user');
            return;
        }

        await member.ban({ reason: reason });

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle('__Adramelech Ban__')
                    .setDescription(`
                    User ${user} has been banned
                    Reason ${reason}
                    Author: ${intr.user}
                    `),
            ],
        });
    },
};

export = ban;