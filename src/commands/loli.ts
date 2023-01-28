import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import checkNsfwChannel from './utils/checkNsfwChannel';

type IBooru = IBooru2[];
interface IBooru2 {
    id: number;
    tags: string;
    created_at: number;
    creator_id: number;
    author: string;
    change: number;
    source: string;
    score: string;
    md5: string;
    file_size: number;
    file_url: string;
    is_shown_in_index: boolean;
    preview_url: string;
    preview_width: number;
    preview_height: number;
    actual_preview_width: number;
    actual_preview_height: number;
    sample_url: string;
    sample_width: number;
    sample_height: number;
    sample_file_size: number;
    jpeg_url: string;
    jpeg_width: number;
    jpeg_height: number;
    jpeg_file_size: number
    rating: string;
    has_children: boolean;
    // undefined if not has a parent post
    parent_id?: number;
    // ///
    status: string;
    width: number;
    height: number;
    id_held: boolean;
    // for videos
    frames_pending_string?: string;
    frames_pending?: unknown[];
    frames_string?: string;
    frames?: unknown[];
    // ///
}

export = {
    data: new SlashCommandBuilder()
        .setName('loli')
        .setDescription('Return a loli image (NSFW)'),
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

        const value = Math.floor(Math.random() * 101);

        const response: IBooru = await (await fetch(`https://lolibooru.moe/post/index.json?tags=nude&limit=${value}`)).json();

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
            .setImage(encodeURI(response[value - 1].file_url))
            .setFooter({ text: 'Powered by https://lolibooru.moe' });

        await interaction.reply({ embeds: [embed] });
    },
};