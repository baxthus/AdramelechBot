import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

interface Command {
    // wtf?
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | Omit<SlashCommandBuilder, 'addBooleanOption' | 'addUserOption' | 'addChannelOption' | 'addRoleOption' | 'addAttachmentOption' | 'addMentionableOption' | 'addStringOption' | 'addIntegerOption' | 'addNumberOption'>;
    execute(intr: ChatInputCommandInteraction): Promise<void>
}

export default Command;