import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

interface Command {
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    execute(intr: ChatInputCommandInteraction): Promise<void>
}

export default Command;