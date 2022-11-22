import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

function formatArray(arr: Array<string>) {
    return String(arr.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase().replaceAll('-', ' ');
    })).replaceAll(',', ', ');
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
                        .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        async function repoCommand() {
            const user = interaction.options.getString('user');
            const repo = interaction.options.getString('repository');

            let licenseField;

            const res = await (await fetch(`https://api.github.com/repos/${user}/${repo}`)).json();

            if (res.message) {
                return await interaction.reply({ embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('`' + res.message + '`'),
                ], ephemeral: true });
            }

            const mainField = `
            **Name:** ${res.name}
            **ID:** ${res.id}
            **Description:** ${(res.description !== null) ? '`' + res.description + '`' : 'None'}
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

            if (res.license !== null) {
                const license = await (await fetch(`https://api.github.com/licenses/${res.license.key}`)).json();

                licenseField = `
                **Name:** ${license.name}
                **Permissions:** ${(license.permissions.length === 0) ? 'No Permissions' : '`' + formatArray(license.permissions) + '`'}
                **Conditions:** ${(license.conditions.length === 0) ? 'No Conditions' : '`' + formatArray(license.conditions) + '`'}
                **Limitations:** ${(license.limitations.length === 0) ? 'No Limitations' : '`' + formatArray(license.limitations) + '`'}
                `;
            } else {
                licenseField = 'No license';
            }

            const embed = new EmbedBuilder().setColor([203, 166, 247])
                .setTitle('Github Repo Info__')
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

        async function userCommand() {
            const user = interaction.options.getString('user');

            let buttons;

            const res = await (await fetch(`https://api.github.com/users/${user}`)).json();

            if (res.message) {
                return await interaction.reply({ embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('`' + res.message + '`'),
                ], ephemeral: true });
            }

            const message = `
            **Username:** ${res.login}
            **ID:** ${res.id}
            **Type:** ${res.type}
            **Name:** ${(res.name !== null) ? res.name : 'No'}
            **Company:** ${(res.company !== null) ? res.company : 'No'}
            **Website:** ${(res.blog !== null) ? res.blog : 'No'}
            **Location:** ${(res.location !== null) ? res.location : 'No'}
            **Bio:** ${(res.bio !== null) ? '`' + res.bio + '`' : 'No'}
            **Twitter username:** ${(res.twitter_username !== null) ? res.twitter_username : 'No'}
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

            if (res.twitter_username !== null) {
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

        const subcommand = interaction.options.getSubcommand().toLowerCase();

        // I chose to use Switch because I intend to add more subcommands
        switch (subcommand) {
            case 'repo':
                repoCommand();
                break;
            case 'user':
                userCommand();
                break;
        }
    },
};