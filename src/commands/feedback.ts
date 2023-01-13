import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, WebhookClient } from 'discord.js';
import config from '../config';

export = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Share your feedback')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Select the category')
                .setRequired(true)
                .addChoices(
                    { name: 'Feature request', value: 'featRequest' },
                    { name: 'Bug report', value: 'bugReport' },
                    { name: 'Suggestion', value: 'suggestion' },
                    { name: 'Other', value: 'other' }
                ))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Type your message')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const category = interaction.options.getString('category') ?? '';
        const message = interaction.options.getString('message');

        // create new instance of `WebhookClient`
        const webhookClient = new WebhookClient({ url: config.bot.feedbackWebhook });

        const feedbackEmbed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle('Adramelech Feedback')
            .setDescription('From `' + interaction.user.tag + '` (`' + interaction.user.id + '`)')
            .addFields(
                {
                    name: ':bar_chart: **Type**',
                    value: '```\n' + category + '\n```',
                },
                {
                    name: ':page_facing_up: **Message**',
                    value: '```\n' + message + '\n```',
                }
            );

        // try sending the feedback
        try {
            webhookClient.send({
                username: 'Adramelech Feedback',
                avatarURL: config.bot.image,
                embeds: [feedbackEmbed],
            });
        } catch {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('Error sending the feedback'),
                ], ephemeral: true,
            });
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor([203, 166, 247])
                    .setTitle('Feedback successfully sent'),
            ],
        });
    },
};