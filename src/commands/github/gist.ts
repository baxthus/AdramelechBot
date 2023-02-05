import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

type GistInfo = Array<{
    message?: string;
    html_url: string;
    owner: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
        type: string;
    };
    description: string;
    id: string;
    comments: number;
}>

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

    const content: GistInfo = res;

    if (!content.length) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription(`The user ${user} has no Gists`),
            ], ephemeral: true,
        });
    }

    const userField = `
    **Username:** ${content[0].owner.login}
    **ID:** \`${content[0].owner.id}\`
    **Type:** \`${content[0].owner.type}\`
    `;

    const latestGistField = `
    **Description:** ${(content[0].description) ? `\`${content[0].description}\`` : 'No description'}
    **ID:** \`${content[0].id}\`
    **Comments:** ${content[0].comments}
    `;

    const embed = new EmbedBuilder().setColor(embedColor)
        .setTitle('__Github User Gists Info__')
        .setThumbnail(content[0].owner.avatar_url)
        .addFields(
            {
                name: ':bust_in_silhouette: **User**',
                value: userField,
            },
            {
                name: ':1234: **Number of Gists**',
                value: `\`${content.length}\``,
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
                .setURL(content[0].owner.html_url),
            new ButtonBuilder()
                .setLabel('Open latest Gist')
                .setStyle(ButtonStyle.Link)
                .setURL(content[0].html_url),
        );

    await interaction.reply({ embeds: [embed], components: [buttons] });
}