import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { E6 } from 'furry-wrapper';
import checkNsfwChannel from './utils/checkNsfwChannel';

interface IYiff {
    id: number;
    created_at: string;
    updated_at: string;
    file: {
        width: number;
        height: number;
        ext: string;
        size: number;
        md5: string;
        url: string;
    };
    preview: {
        width: number;
        height: number;
        url: string;
    }
    sample: {
        has: boolean;
        height: number;
        width: number;
        url: string;
        alternates?: object;
    };
    scores: { up: number; down: number; total: number; };
    tags: {
        general: string[];
        species: string[];
        character: string[];
        copyright: string[];
        artist: string[];
        invalid: unknown[];
        lore: unknown[];
        meta: string[];
    };
    locked_tags: string[];
    change_seq: number;
    flags: {
        pending: boolean;
        flagged: boolean;
        note_blocked: boolean;
        status_locked: boolean;
        rating_locked: boolean;
        comment_disable: boolean;
        deleted: boolean;
    };
    rating: string;
    fav_count: number;
    sources: string[];
    pools: unknown[];
    relationships: {
        parent_id?: number;
        has_children: boolean;
        has_active_children: boolean;
        children: unknown[];
    };
    approver_id: number;
    uploader_id: number;
    description: string;
    comment_count: number;
    is_favorited: boolean;
    has_notes: boolean;
    duration?: unknown;
}

export = {
    data: new SlashCommandBuilder()
        .setName('yiff2')
        .setDescription('Return a yiff (furry porn) image (NSFW) (BETA)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Separate categories using space')
                .setRequired(true)),
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const choice: any = interaction.options.getString('category');
        let img: IYiff;

        // Try to request
        // Why try? because the user can put a screwed up tag and fuck it all up
        try {
            // this is a horrible way of doing this,
            // but is the only way I could get it to work
            await E6.nsfw(choice).then(res => {
                img = JSON.parse(JSON.stringify(res));
            });
        } catch {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__'),
                ], ephemeral: true,
            });
        }

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .setImage(img!.file.url)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .setFooter({ text: `Powered by https://e621.net\nArtists: ${img!.tags.artist.join(', ')}` });

        await interaction.reply({ embeds: [embed] });
    },
};