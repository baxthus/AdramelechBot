import ButtonArgs from '@interfaces/ButtonArgs';
import { EmbedBuilder } from 'discord.js';
import { embedColor } from '@config';

export = async function ({ intr }: ButtonArgs): Promise<void> {
    // This is not the correct way to do this. Too bad.
    const startTime = Date.now();
    await fetch('https://discord.com/api/v6');
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    const velocityEmbed = new EmbedBuilder().setColor(embedColor)
        .setTitle('__Adramelech Velocity Test__')
        .setDescription(`Response time from our servers to Discord Endpoint is ${responseTime}ms`);

    await intr.update({ embeds: [velocityEmbed], components: [] });
};