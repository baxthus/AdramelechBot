import { Events, Client } from 'discord.js';

export = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        client.user?.setPresence({ activities: [{ name: 'your mom <3', type: 3 }] });
        console.log(`Ready! Logged is as ${client.user?.tag}`);
    },
};