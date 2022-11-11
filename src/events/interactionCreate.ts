import { Events } from 'discord.js';

export = {
    name: Events.InteractionCreate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(interaction: any) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};