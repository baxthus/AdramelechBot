import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import formatArray from './utils/formatArray';

export default async function (interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString('user');
    const repo = interaction.options.getString('repository');

    let licenseField;

    const res = await (await fetch(`https://api.github.com/repos/${user}/${repo}`)).json();

    if (res.message) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription(`\`${res.message}\``),
            ], ephemeral: true,
        });
    }

    const mainField = `
    **Name:** ${res.name}
    **ID:** ${res.id}
    **Description:** ${(res.description) ? `\`${res.description}\`` : 'None'}
    **It's a fork:** ${(res.fork) ? 'Yes' : 'No'}
    **Principal language:** ${res.language}
    **Starts:** ${res.stargazers_count}
    **Watchers:** ${res.watchers_count}
    **Forks:** ${res.forks_count}
    `;

    const ownerField = `
    **Username:** ${res.owner.login}
    **ID:** ${res.owner.id}
    **Type:** ${res.owner.type}
    `;

    if (res.license) {
        const license = await (await fetch(`https://api.github.com/licenses/${res.license.key}`)).json();

        licenseField = `
        **Name:** ${license.name}
        **Permissions:** ${(license.permissions.length) ? formatArray(license.permissions) : `\`${'No Permissions'}\``}
        **Conditions:** ${(license.conditions.length) ? formatArray(license.conditions) : `\`${'No Conditions'}\``}
        **Limitations:** ${(license.limitations.length) ? formatArray(license.limitations) : `\`${'No Limitations'}\``}
        `;
    } else {
        licenseField = 'No license';
    }

    const embed = new EmbedBuilder().setColor([203, 166, 247])
        .setTitle('__Github Repo Info__')
        .addFields(
            {
                name: ':zap: **Main**',
                value: mainField,
            },
            {
                name: ':bust_in_silhouette: **Owner**',
                value: ownerField,
            },
            {
                name: ':scroll: **License**',
                value: licenseField,
            },
        );

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Open repository')
                .setStyle(ButtonStyle.Link)
                .setURL(res.html_url),
            new ButtonBuilder()
                .setLabel('Open repository owner')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://github.com/${res.owner.login}`)
        );

    await interaction.reply({ embeds: [embed], components: [buttons] });
}