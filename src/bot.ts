import fs from 'node:fs';
import path from 'node:path';
import { Client, GatewayIntentBits, Collection, ApplicationCommandData } from 'discord.js';
import config from './config';

export class CustomClient extends Client {
    commands: Collection<string, ApplicationCommandData> = new Collection();
}

const client = new CustomClient({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath);

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(config.bot.token);