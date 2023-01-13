import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

function formatArray(arr: Array<string>) {
    return String(arr.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase().replaceAll('-', ' ');
    })).replaceAll(',', ', ');
}

async function repoCommand(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString('user');
    const repo = interaction.options.getString('repository');

    let licenseField;

    const res = await (await fetch(`https://api.github.com/repos/${user}/${repo}`)).json();

    if (res.message) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('`' + res.message + '`'),
            ], ephemeral: true,
        });
    }

    const mainField = `
    **Name:** ${res.name}
    **ID:** ${res.id}
    **Description:** ${(res.description) ? '`' + res.description + '`' : 'None'}
    **It's a fork:** ${res.fork ? 'Yes' : 'No'}
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
        **Permissions:** ${(license.permissions.length) ? formatArray(license.permissions) : '`' + 'No Permissions' + '`'}
        **Conditions:** ${(license.conditions.length) ? formatArray(license.conditions) : '`' + 'No Conditions' + '`'}
        **Limitations:** ${(license.limitations.length) ? formatArray(license.limitations) : '`' + 'No Limitations' + '`'}
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
            }
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

async function userCommand(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString('user');

    let buttons;

    const res = await (await fetch(`https://api.github.com/users/${user}`)).json();

    if (res.message) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('`' + res.message + '`'),
            ], ephemeral: true,
        });
    }

    const message = `
            **Username:** ${res.login}
            **ID:** ${res.id}
            **Type:** ${res.type}
            **Name:** ${(res.Name) ? res.name : 'No'}
            **Company:** ${(res.company) ? res.company : 'No'}
            **Website:** ${(res.blog) ? res.blog : 'No'}
            **Location:** ${(res.location) ? res.location : 'No'}
            **Bio:** ${(res.bio) ? '`' + res.bio + '`' : 'No'}
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

async function gistCommand(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString('user');

    const res = await (await fetch(`https://api.github.com/users/${user}/gists`)).json();

    if (res.message) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('`' + res.message + '`'),
            ], ephemeral: true,
        });
    }

    if (!res.length) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('The user ' + user + ' has no Gists'),
            ], ephemeral: true,
        });
    }

    const userField = `
    **Username:** ${res[0].owner.login}
    **ID:** ${'`' + res[0].owner.id + '`'}
    **Type:** ${'`' + res[0].owner.id + '`'}
    `;

    const latestGistField = `
    **Description:** ${(res[0].description) ? '`' + res[0].description + '`' : 'No description'}
    **ID:** ${'`' + res[0].id + '`'}
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
                value: '`' + res.length + '`',
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
                .setURL(`https://gist.github.com/${res[0].owner.login}`),
            new ButtonBuilder()
                .setLabel('Open user Github')
                .setStyle(ButtonStyle.Link)
                .setURL(res[0].owner.html_url),
            new ButtonBuilder()
                .setLabel('Open latest Gist')
                .setStyle(ButtonStyle.Link)
                .setURL(res[0].html_url)
        );

    await interaction.reply({ embeds: [embed], components: [buttons] });
}

export = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Get Github user or repository info')
        .addSubcommand(subcommand =>
            subcommand.setName('repo')
                .setDescription('Info about a repository')
                .addStringOption(option =>
                    option.setName('user')
                        .setDescription('Github user')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('repository')
                        .setDescription('Github repository')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('user')
                .setDescription('Info about a user')
                .addStringOption(option =>
                    option.setName('user')
                        .setDescription('Github user')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('gist')
                .setDescription('Info about a user Gists')
                .addStringOption(option =>
                    option.setName('user')
                        .setDescription('Github user')
                        .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand().toLowerCase();

        switch (subcommand) {
            case 'repo':
                repoCommand(interaction); break;
            case 'user':
                userCommand(interaction); break;
            case 'gist':
                gistCommand(interaction); break;
        }
    },
};