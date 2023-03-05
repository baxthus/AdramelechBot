import errorResponse from '@utils/errorResponse';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';

interface IUser {
    message?: string;
    login: string;
    id: number;
    type: string;
    name: string;
    company: string;
    blog: string;
    location: string;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    avatar_url: string;
    html_url: string;
}

export default async function (intr: ChatInputCommandInteraction): Promise<void> {
    const user = intr.options.getString('user', true);

    const res: IUser = await (await fetch(`https://api.github.com/users/${user}`)).json();

    if (res.message) {
        await errorResponse(intr, `\`${res.message}\``);
        return;
    }

    const message = `
    **Username:** ${res.login}
    **ID:** ${res.id}
    **Type:** ${res.type}
    **Name:** ${(res.name) ? res.name : 'No'}
    **Company:** ${(res.company) ? res.company : 'No'}
    **Blog:** ${(res.blog) ? res.blog : 'No'}
    **Location:** ${(res.location) ? res.location : 'No'}
    **Bio:** ${(res.bio) ? res.bio : 'No'}
    **Twitter username:** ${(res.twitter_username) ? res.twitter_username : 'No'}
    **Public repos:** ${res.public_repos}
    **Public gists:** ${res.public_gists}
    **Followers:** ${res.followers}
    **Following:** ${res.following}
    `;

    const embed = new EmbedBuilder().setColor(embedColor)
        .setTitle('__Adramelech User Info__')
        .setThumbnail(res.avatar_url)
        .addFields({
            name: '\u200B',
            value: message,
        });

    let buttons: ActionRowBuilder<ButtonBuilder>;

    if (res.twitter_username) {
        buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Open user Github')
                    .setStyle(ButtonStyle.Link)
                    .setURL(res.html_url),
                new ButtonBuilder()
                    .setLabel('Open user Twitter')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://twitter.com/${res.twitter_username}`)
            );
    } else {
        buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Open user')
                    .setStyle(ButtonStyle.Link)
                    .setURL(res.html_url)
            );
    }

    await intr.reply({ embeds: [embed], components: [buttons] });
}
