import { SlashCommandBuilder } from 'discord.js';
import repoCommand from './github/repo';
import userCommand from './github/user';
import gistCommand from './github/gist';
import Command from '@interfaces/Command';

const github: Command = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Get Github related info')
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
    async execute(intr) {
        const subcommand = intr.options.getSubcommand().toLowerCase();

        // this is shit, should i do everything in one file?
        switch (subcommand) {
            case 'repo':
                repoCommand(intr); break;
            case 'user':
                userCommand(intr); break;
            case 'gist':
                gistCommand(intr); break;
        }
    },
};

export = github;