import Event from '@interfaces/Event';
import { CommandInteraction, Events } from 'discord.js';
import { CustomClient } from 'src/bot';

export = {
    name: Events.InteractionCreate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(intr: CommandInteraction) {
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
} as Event;