import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import Yiffy from 'yiffy';
import checkNsfwChannel from './utils/checkNsfwChannel';

const yiff = new Yiffy();

async function shitFunction(choice: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const category_list: any = {
        'straight': await yiff.images.furry.yiff.straight(),
        'gay': await yiff.images.furry.yiff.gay(),
        'lesbian': await yiff.images.furry.yiff.lesbian(),
        'gynomorph': await yiff.images.furry.yiff.gynomorph(),
        'andromorph': await yiff.images.furry.yiff.andromorph(),
    };

    return category_list[choice];
}

export = {
    data: new SlashCommandBuilder()
        .setName('yiff')
        .setDescription('Return a yiff (furry porn) image (NSFW)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Select the category')
                .setRequired(true)
                .addChoices(
                    { name: 'Straight', value: 'straight' },
                    { name: 'Gay', value: 'gay' },
                    { name: 'Lesbian', value: 'lesbian' },
                    { name: 'Gynomorph', value: 'gynomorph' },
                    { name: 'Andromorph', value: 'andromorph' },
                )),
    async execute(interaction: ChatInputCommandInteraction) {
        if (checkNsfwChannel(interaction)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('Your not in a NSFW/DM channel'),
                ], ephemeral: true,
            });
        }

        const choice = interaction.options.getString('category') ?? '';
        let img: string;

        // Check if this shit is being rate limited
        // This will become a problem if a lot of people use this command
        // Sounds like a big load of not my problem
        try {
            img = (await shitFunction(choice)).url;
        } catch {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('We are being rate limited, sorry for the inconvenience'),
                ], ephemeral: true,
            });
        }

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setImage(img)
            .setFooter({ text: 'Powered by https://yiff.rest' });

        await interaction.reply({ embeds: [embed] });
    },
};