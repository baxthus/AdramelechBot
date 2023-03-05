import ButtonArgs from '@interfaces/ButtonArgs';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

export = async function ({ intr }: ButtonArgs): Promise<void> {
    // This is not the correct way to do this. Too bad.
    const startTime = performance.now();
    fetch('https://discord.com/api/v6');
    const endTime = performance.now();

    // https://stackoverflow.com/a/50075070
    const responseTime = String(endTime - startTime).replace(/\.(\d{1,2}).*$/, '.$1');

    const velocityEmbed = new EmbedBuilder().setColor(embedColor)
        .setTitle('__Adramelech Velocity Test__')
        .setDescription(`Response time from our servers to Discord Endpoint is ${responseTime}ms`);

    await intr.update({ embeds: [velocityEmbed], components: [], files: [] });
};