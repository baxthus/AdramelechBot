import { Player } from 'discord-player';
import { ChatInputCommandInteraction } from 'discord.js';

interface MusicCommandArgs {
    intr: ChatInputCommandInteraction;
    player: Player;
}

export default MusicCommandArgs;