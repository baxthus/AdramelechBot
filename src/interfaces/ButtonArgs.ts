import { ButtonInteraction } from 'discord.js';
import { CustomClient } from '../bot';
import ButtonID from './ButtonID';

interface ButtonArgs {
    intr: ButtonInteraction;
    client?: CustomClient;
    customId?: ButtonID;
}

export default ButtonArgs;