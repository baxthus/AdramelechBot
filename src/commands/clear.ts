import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { embedColor } from '@config';

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
    async execute(intr: any) {
        const amount = intr.options.getInteger('amount');

        await intr.channel?.bulkDelete(amount);

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle('__Adramelech Clear__')
                    .setDescription(`
                    Successfully deleted ${amount} messages
                    Command executed by ${intr.user}
                    `),
            ],
        }).then(() => {
            setTimeout(() => intr.deleteReply(), 5000);
        });
    },
};

export = clear;