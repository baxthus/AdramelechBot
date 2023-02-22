import { Queue } from 'discord-player';
import { ButtonInteraction } from 'discord.js';
import { CustomClient } from 'src/bot';

interface MusicButtonArgs {
    client: CustomClient;
    intr: ButtonInteraction;
    customId: ButtonID;
    queue: Queue<unknown> | undefined;
}

export default MusicButtonArgs;