import formatArray from '@utils/formatArray';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';
import errorResponse from '@utils/errorResponse';

interface IRepo {
    message?: string;
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

interface ILicense {
    name: string;
    permissions: Array<string>;
    conditions: Array<string>;
    limitations: Array<string>;
}

export default async function (intr: ChatInputCommandInteraction): Promise<void> {
    const user = intr.options.getString('user', true);
    const repo = intr.options.getString('repository', true);

    const res: IRepo = await (await fetch(`https://api.github.com/repos/${user}/${repo}`)).json();

    if (res.message) {
        await errorResponse(intr, `\`${res.message}\``);
        return;
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

    let licenseField: string;

    if (res.license) {
        const license: ILicense = await (await fetch(`https://api.github.com/licenses/${res.license.key}`)).json();

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
        .setTitle('__Adramelech Repo Info__')
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

    await intr.reply({ embeds: [embed], components: [buttons] });
}
