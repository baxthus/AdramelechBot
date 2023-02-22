import Command from '@interfaces/Command';
import { AudioFilters } from 'discord-player';
import { SlashCommandBuilder } from 'discord.js';
import player from 'src/music';
import back from './music/back';
import clear from './music/clear';
import filter from './music/filter';
import jump from './music/jump';
import loop from './music/loop';


const music: Command = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Music related commands')
        // back
        .addSubcommand(subcommand =>
            subcommand.setName('back')
                .setDescription('Go back the song before'))
        // clear
        .addSubcommand(subcommand =>
            subcommand.setName('clear')
                .setDescription('Clear all the music in the queue'))
        // controller - Manage Messages Permission
        // .addSubcommand(subcommand =>
        //     subcommand.setName('controller')
        //         .setDescription('Set controller channel')
        //         .addChannelOption(option =>
        //             option.setName('channel')
        //                 .setDescription('The channel you want to send it to')
        //                 .setRequired(true)))
        // filter
        .addSubcommand(subcommand =>
            subcommand.setName('filter')
                .setDescription('Add a filter to your track')
                .addStringOption(option =>
                    option.setName('filter')
                        .setDescription('Filter you want to add')
                        .setRequired(true)
                        // don't try to understand
                        .setChoices(...Object.keys(AudioFilters.filters).map(m => Object({ name: m, value: m })).splice(0, 25))))
        // jump
        .addSubcommand(subcommand =>
            subcommand.setName('jump')
                .setDescription('Jump to particular track in queue')
                .addStringOption(option =>
                    option.setName('song')
                        .setDescription('The name/url of the track you want to jump to'))
                .addNumberOption(option =>
                    option.setName('number')
                        .setDescription('The place in the queue the song is in')))
        // loop
        .addSubcommand(subcommand =>
            subcommand.setName('loop')
                .setDescription('Enable/disable looping the song\'s or the whole queue')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('What you want to perform a loop')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Song', value: 'enable_loop_song' },
                            { name: 'Queue', value: 'enable_loop_queue' },
                            { name: 'Disable', value: 'disable_loop' }
                        )))
        // now-playing
        .addSubcommand(subcommand =>
            subcommand.setName('now-playing')
                .setDescription('Show the current song playing')),
    async execute(intr) {
        const subcommand = intr.options.getSubcommand();

        switch (subcommand) {
            case 'back':
                back(intr, player); break;
            case 'clear':
                clear(intr, player); break;
            case 'filter':
                filter(intr, player); break;
            case 'jump':
                jump(intr, player); break;
            case 'loop':
                loop(intr, player); break;
        }
    },
};

export = music;