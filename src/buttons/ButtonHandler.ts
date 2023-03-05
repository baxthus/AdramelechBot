import ButtonArgs from '@interfaces/ButtonArgs';
import ButtonID from '@interfaces/ButtonID';
import { ButtonInteraction } from 'discord.js';

export default async function (intr: ButtonInteraction): Promise<void> {
    const customId = JSON.parse(intr.customId) as ButtonID;
    if (!customId.file) return;

    // * As you can see, the button custom id is very important,
    // * and can break if not used properly.
    // ! Just use file names that is in the buttons folder

    delete require.cache[require.resolve(`./normal/${customId.file}`)];

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const button = require(`./normal/${customId.file}`);
    if (button) {
        button({ intr } as ButtonArgs);
    }
}