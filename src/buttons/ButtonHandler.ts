import MusicButtonArgs from '@interfaces/MusicButtonArgs';
import { ButtonInteraction } from 'discord.js';
import client from 'src/bot';
import player from 'src/music';

export default async function (intr: ButtonInteraction): Promise<void> {
    const customId = JSON.parse(intr.customId) as ButtonID;
    if (!customId.file) return;

    // * As you can see, the button custom id is very important,
    // * and can break if not used properly.
    // ! Just use file names that is in the buttons folder
    if (customId.music) {
        delete require.cache[require.resolve(`./music/${customId.file}`)];

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const button = require(`./music/${customId.file}`);
        const queue = player.getQueue(intr.guildId ?? '');

        if (button) {
            button({ client, intr, customId, queue } as MusicButtonArgs);
            return;
        }

        return;
    }

    // ? others things can be implemented here
}