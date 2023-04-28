import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { embedColor } from '@config';
import errorResponse from '@utils/errorResponse';

const clear: Command = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of messages')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(intr) {
        const amount = intr.options.getInteger('amount', true);

        if (!intr.channel?.isTextBased) {
            await errorResponse(intr, "You are not in a valid text channel");
            return;
        }

        const channel = intr.channel as TextChannel
        const messages = await channel.bulkDelete(amount)

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle('__Adramelech Clear__')
                    .setDescription(`
                    Successfully deleted ${messages.size} messages
                    Command executed by ${intr.user}
                    `),
            ],
        }).then(() => {
            setTimeout(() => intr.deleteReply(), 5000);
        });
    },
};

export = clear;