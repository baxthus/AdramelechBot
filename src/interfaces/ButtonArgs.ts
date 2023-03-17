import { ButtonInteraction } from 'discord.js';
import ButtonID from './ButtonID';

interface ButtonArgs {
    intr: ButtonInteraction;
    customId?: ButtonID;
}

export default ButtonArgs;