import path from 'node:path';
import fs from 'node:fs';
import Command from '@interfaces/Command';

const commands: Array<{ [key: string]: string }> = [];

const commandsPath = path.join(__dirname, '/commands');
const commandFile = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFile) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command: Command = require(`./commands/${file}`);
    commands.push({ [command.data.name]: command.data.description });
    console.log(`Loaded command ${command.data.name}`);
}

if (fs.existsSync('src/commands.json')) {
    fs.unlinkSync('src/commands.json');
}

fs.writeFileSync('src/commands.json', JSON.stringify(commands));