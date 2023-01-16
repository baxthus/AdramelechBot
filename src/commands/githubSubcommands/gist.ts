import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export default async function (interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString('user');

    const res = await (await fetch(`https://api.github.com/users/${user}/gists`)).json();

    if (res.message) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription(`\`${res.message}\``),
            ], ephemeral: true,
        });
    }

    if (!res.length) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription(`The user ${user} has no Gists`),
            ], ephemeral: true,
        });
    }

    const userField = `
    **Username:** ${res[0].owner.login}
    **ID:** \`${res[0].owner.id}\`
    **Type:** \`${res[0].owner.id}\`
    `;

    const latestGistField = `
    **Description:** ${(res[0].description) ? `\`${res[0].description}\`` : 'No description'}
    **ID:** \`${res[0].id}\`
    **Comments:** ${res[0].comments}
    `;

    const embed = new EmbedBuilder().setColor([203, 166, 247])
        .setTitle('__Github User Gists Info__')
        .setThumbnail(res[0].owner.avatar_url)
        .addFields(
            {
                name: ':bust_in_silhouette: **User**',
                value: userField,
            },
            {
                name: ':1234: **Number of Gists**',
                value: `\`${res.length}\``,
            },
            {
                name: ':arrow_up: **Latest Gist**',
                value: latestGistField,
            }
        );

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Open user Gists')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://gist.github.com/${user}`),
            new ButtonBuilder()
                .setLabel('Open user Github')
                .setStyle(ButtonStyle.Link)
                .setURL(res[0].owner.html_url),
            new ButtonBuilder()
                .setLabel('Open latest Gist')
                .setStyle(ButtonStyle.Link)
                .setURL(res[0].html_url),
        );

    await interaction.reply({ embeds: [embed], components: [buttons] });
}