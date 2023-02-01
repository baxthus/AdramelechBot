import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import repoCommand from './github/repo';
import userCommand from './github/user';
import gistCommand from './github/gist';

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

        // this is shit, should i do everything in one file?
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