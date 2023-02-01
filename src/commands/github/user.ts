import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

interface IUser {
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

export default async function (interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString('user');

    let buttons: ActionRowBuilder<ButtonBuilder>;

    const res = await (await fetch(`https://api.github.com/users/${user}`)).json();

    if (res.message) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription(`\`${res.message}\``),
            ], ephemeral: true,
        });
    }

    const content: IUser = res;

    const message = `
    **Username:** ${content.login}
    **ID:** ${content.id}
    **Type:** ${content.type}
    **Name:** ${(content.name) ? content.name : 'No'}
    **Company:** ${(content.company) ? content.company : 'No'}
    **Blog:** ${(content.blog) ? content.blog : 'No'}
    **Location:** ${(content.location) ? content.location : 'No'}
    **Bio:** ${(content.bio) ? content.bio : 'No'}
    **Twitter username:** ${(content.twitter_username) ? content.twitter_username : 'No'}
    **Public repos:** ${content.public_repos}
    **Public gists:** ${content.public_gists}
    **Followers:** ${content.followers}
    **Following:** ${content.following}
    `;

    const embed = new EmbedBuilder().setColor([203, 166, 247])
        .setTitle('__Github User Info__')
        .setThumbnail(content.avatar_url)
        .addFields({
            name: '\u200B',
            value: message,
        });

    if (content.twitter_username) {
        buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Open user Github')
                    .setStyle(ButtonStyle.Link)
                    .setURL(content.html_url),
                new ButtonBuilder()
                    .setLabel('Open user Twitter')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://twitter.com/${content.twitter_username}`)
            );
    } else {
        buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Open user')
                    .setStyle(ButtonStyle.Link)
                    .setURL(content.html_url)
            );
    }

    await interaction.reply({ embeds: [embed], components: [buttons] });
}