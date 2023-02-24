import { REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import path from 'node:path';
import fs from 'node:fs';
import config from './config';
import Command from '@interfaces/Command';

const commands: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

// Grab all the command files from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command: Command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(config.bot.token);

// and deploy!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await rest.put(
            Routes.applicationCommands(config.bot.id),
            { body: commands }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();