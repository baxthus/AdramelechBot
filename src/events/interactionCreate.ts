import Event from '@interfaces/Event';
import { Events, Interaction } from 'discord.js';
import client from 'src/bot';
import ButtonHandler from 'src/buttons/ButtonHandler';

const interactionCreate: Event = {
    name: Events.InteractionCreate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, complexity
    async execute(intr: Interaction) {
        if (intr.isButton()) ButtonHandler(intr);

        if (!intr.isChatInputCommand()) return;

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