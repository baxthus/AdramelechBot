import { Events, Interaction } from 'discord.js';
import { CustomClient } from '../bot';
import Event from '@interfaces/Event';
import ButtonHandler from '../buttons/ButtonHandler';

export = {
    name: Events.InteractionCreate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, complexity
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
} as Event