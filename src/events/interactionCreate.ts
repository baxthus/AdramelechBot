import { Events, Interaction } from 'discord.js';
import { CustomClient } from '../bot';
import Event from '@interfaces/Event';
import ButtonHandler from '../buttons/ButtonHandler';

const interactionCreate: Event = {
    name: Events.InteractionCreate,
    async execute(intr: Interaction) {
        if (intr.isButton()) ButtonHandler(intr);

        if (!intr.isChatInputCommand()) return;

        const client = intr.client as CustomClient;
        const command = client.commands.get(intr.commandName);

        if (!command) return;

        try {
            await command.execute(intr);
        } catch (error) {
            console.error(`Error executing ${intr.commandName}`);
            console.error(error);
        }
    },
};

export = interactionCreate;