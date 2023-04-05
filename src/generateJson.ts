import path from 'node:path';
import fs from 'node:fs';
import Command from '@interfaces/Command';

const helpInfo: Array<{ [key: string]: string }> = [];
const creditsInfo: Array<{ [key: string]: string }> = [];

const commandsPath = path.join(__dirname, '/commands');
const commandFile = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFile) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command: Command = require(`./commands/${file}`);

    helpInfo.push({ [command.data.name]: command.data.description });
    if (command.uses) {
        creditsInfo.push({ [command.data.name]: command.uses.join(', ') });
    }

    console.log(`Loaded command ${command.data.name}`);
}

if (fs.existsSync('src/commands.json')) fs.unlinkSync('src/commands.json');
if (fs.existsSync('src/credits.json')) fs.unlinkSync('src/credits.json');

fs.writeFileSync('src/commands.json', JSON.stringify(helpInfo));
fs.writeFileSync('src/credits.json', JSON.stringify(creditsInfo));