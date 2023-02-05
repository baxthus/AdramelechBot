import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

function formatArray(arr: Array<string>) {
    return String(arr.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase().replaceAll('-', ' ');
    })).replace(',', ', ');
}

type RepoInfo = {
    id: number;
    name: string;
    html_url: string;
    description: string;
    fork: boolean;
    language: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    owner: {
        login: string;
        id: number;
        type: string;
    }
    license?: {
        key: string;
    }
}

type LicenseInfo = {
    name: string;
    permissions: Array<string>;
    conditions: Array<string>;
    limitations: Array<string>;
}

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

    const content: RepoInfo = res;

    const mainField = `
    **Name:** ${content.name}
    **ID:** ${content.id}
    **Description:** ${(content.description) ? `\`${content.description}\`` : 'None'}
    **It's a fork:** ${(content.fork) ? 'Yes' : 'No'}
    **Principal language:** ${content.language}
    **Starts:** ${content.stargazers_count}
    **Watchers:** ${content.watchers_count}
    **Forks:** ${content.forks_count}
    `;

    const ownerField = `
    **Username:** ${content.owner.login}
    **ID:** ${content.owner.id}
    **Type:** ${content.owner.type}
    `;

    if (content.license) {
        const license: LicenseInfo = await (await fetch(`https://api.github.com/licenses/${content.license.key}`)).json();

        licenseField = `
        **Name:** ${license.name}
        **Permissions:** ${(license.permissions.length) ? formatArray(license.permissions) : `\`${'No Permissions'}\``}
        **Conditions:** ${(license.conditions.length) ? formatArray(license.conditions) : `\`${'No Conditions'}\``}
        **Limitations:** ${(license.limitations.length) ? formatArray(license.limitations) : `\`${'No Limitations'}\``}
        `;
    } else {
        licenseField = 'No license';
    }

    const embed = new EmbedBuilder().setColor(embedColor)
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
                .setURL(content.html_url),
            new ButtonBuilder()
                .setLabel('Open repository owner')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://github.com/${content.owner.login}`)
        );

    await interaction.reply({ embeds: [embed], components: [buttons] });
}