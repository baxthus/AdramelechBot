import Command from '@interfaces/Command';
import { EmbedBuilder, SlashCommandBuilder, WebhookClient, WebhookCreateMessageOptions } from 'discord.js';
import config from '@config';
import errorResponse from '@utils/errorResponse';

interface IFeedback {
    category: string;
    message: string;
}

const feedback: Command = {
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
                .setDescription('Write your feedback')
                .setRequired(true)),
    async execute(intr) {
        const feedbackInfo: IFeedback = {
            category: intr.options.getString('category', true),
            message: intr.options.getString('message', true),
        };

        const feedbackEmbed = new EmbedBuilder().setColor(config.bot.embedColor)
            .setTitle('Adramelech Feedback')
            .setDescription(`From \`${intr.user.tag}\` (\`${intr.user.id}\`)`)
            .addFields(
                {
                    name: ':bar_chart: **Category**',
                    value: `\`\`\`${feedbackInfo.category}\`\`\``,
                },
                {
                    name: ':page_facing_up: **Message**',
                    value: `\`\`\`${feedbackInfo.message}\`\`\``,
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
            await errorResponse(intr, 'Error sending the feedback');
            return;
        }

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(config.bot.embedColor)
                    .setTitle('Feedback successfully sent'),
            ],
        });
    },
};

export = feedback;