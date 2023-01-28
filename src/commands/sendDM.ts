import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, User } from 'discord.js';
import config from '../config';

interface IMessage {
    user: User;
    message: string;
}

export = {
    data: new SlashCommandBuilder()
        .setName('send-dm')
        .setDescription('DM a message (bot owner only)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Mention a user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Your message')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== config.owner.id) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('Your not the bot owner'),
                ], ephemeral: true,
            });
        }

        const message: IMessage = {
            user: interaction.options.getUser('user') ?? interaction.user,
            message: interaction.options.getString('message') ?? '',
        };

        try {
            await message.user.send(message.message);
        } catch {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('Error sending message'),
                ], ephemeral: true,
            });
        }

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle('__Adramelech DM Sender__')
            .setDescription('Message send successfully!')
            .setThumbnail(config.bot.image);

        await interaction.reply({ embeds: [embed] });
    },
};