import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

// wtf?
type SlashCommand = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | Omit<SlashCommandBuilder, 'addBooleanOption' | 'addUserOption' | 'addChannelOption' | 'addRoleOption' | 'addAttachmentOption' | 'addMentionableOption' | 'addStringOption' | 'addIntegerOption' | 'addNumberOption'>

interface Command {
    data: SlashCommand;
    execute(intr: ChatInputCommandInteraction): Promise<void>
}

export default Command;