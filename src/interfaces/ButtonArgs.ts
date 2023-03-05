import { Queue } from 'discord-player';
import { ButtonInteraction } from 'discord.js';
import { CustomClient } from 'src/bot';
import ButtonID from './ButtonID';

interface ButtonArgs {
    intr: ButtonInteraction;
    client?: CustomClient;
    customId?: ButtonID;
    queue?: Queue<unknown> | undefined;
}

export default ButtonArgs;