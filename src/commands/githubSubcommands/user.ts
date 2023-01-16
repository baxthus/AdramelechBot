import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export default async function (interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString('user');

    let buttons;

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

    const embed = new EmbedBuilder().setColor([203, 166, 247])
        .setTitle('__Github User Info__')
        .setThumbnail(res.avatar_url)
        .addFields({
            name: '\u200B',
            value: message,
        });

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

    await interaction.reply({ embeds: [embed], components: [buttons] });
}