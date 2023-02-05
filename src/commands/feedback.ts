import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, WebhookClient, WebhookCreateMessageOptions } from 'discord.js';
import config from 'src/config';

type Feedback = {
    category: string;
    message: string;
}

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
        const feedback: Feedback = {
            category: interaction.options.getString('category') ?? '',
            message: interaction.options.getString('message') ?? '',
        };

        const feedbackEmbed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle('Adramelech Feedback')
            .setDescription(`From \`${interaction.user.tag}\` (\`${interaction.user.id}\`)`)
            .addFields(
                {
                    name: ':bar_chart: **Category**',
                    value: `\`\`\`${feedback.category}\`\`\``,
                },
                {
                    name: ':page_facing_up: **Message**',
                    value: `\`\`\`${feedback.message}\`\`\``,
                }
            );

        const webhookOptions: WebhookCreateMessageOptions = {
            username: 'Adramelech Feedback',
            avatarURL: config.bot.image,
            embeds: [feedbackEmbed],
        };

        const webhookClient = new WebhookClient({ url: config.bot.feedbackWebhook });

        try {
            webhookClient.send(webhookOptions);
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
                new EmbedBuilder().setColor(config.bot.embedColor)
                    .setTitle('Feedback successfully sent'),
            ],
        });
    },
};