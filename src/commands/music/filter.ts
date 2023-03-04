import MusicCommandArgs from '@interfaces/MusicCommandArgs';
import errorResponse from '@utils/errorResponse';
import { QueueFilters } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export default async function ({ intr, player }: MusicCommandArgs): Promise<void> {
    const inFilter = intr.options.getString('filter');
    const queue = player.getQueue(intr.guildId ?? '');

    if (!queue || !queue.playing) {
        await errorResponse(intr, 'No music currently playing');
        return;
    }

    const actualFilter = queue.getFiltersEnabled()[0];

    type coolType = keyof QueueFilters
    const filters: coolType[] = [];

    queue.getFiltersEnabled().map(x => filters.push(x));
    queue.getFiltersDisabled().map(x => filters.push(x));

    const filter = filters.find(x => x.toLowerCase() === inFilter?.toLowerCase());

    if (!filter) {
        await errorResponse(intr, `
        This filter don't exist\n
        ${actualFilter ? `Filter currently active ${actualFilter}\n` : ''}
        List of available filters ${filters.map(x => `**${x}**`).join(', ')}
        `);
        return;
    }

    const filtersUpdated: Record<string, boolean> = {};

    filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

    await queue.setFilters(filtersUpdated);

    await intr.reply({
        embeds: [
            new EmbedBuilder().setColor(embedColor).setTitle(`
            The filter ${filter} is now **${queue.getFiltersEnabled().includes(filter) ? 'enabled' : 'disabled'}**\n
            *Reminder the longer the music is, the longer this will take*
            `),
        ],
    });
}