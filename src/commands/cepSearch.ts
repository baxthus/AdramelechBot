import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { botImage, embedColor } from 'src/config';
import errorResponse from 'src/utils/errorResponse';

interface ICep {
    name?: string;
    message?: string;
    type?: string;
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    service: string;
    location: {
        type: string;
        coordinates: {
            longitude: string;
            latitude: string;
        };
    };
}

const cepSearch: Command = {
    data: new SlashCommandBuilder()
        .setName('cep-search')
        .setDescription('Search for CEP (Brazilian postal code)')
        .addStringOption(option =>
            option.setName('cep')
                .setDescription('CEP that you want search')
                .setRequired(true)),
    async execute(intr) {
        const cep = intr.options.getString('cep')?.replace('-', '');

        const res: ICep = await (await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)).json();

        if (res.name) {
            const errors = `
            **Name:** \`${res.name}\`
            **Message:** \`${res.message}\`
            **Type:** \`${res.type}\`
            `;

            await errorResponse(intr, errors);
            return;
        }

        const main = `
        **CEP:** ${res.cep}
        **State:** ${res.state}
        **City:** ${res.city}
        **Neighborhood:** ${res.neighborhood}
        **Street:** ${res.street}
        **Service:** ${res.service}
        `;

        const location = `
        **Type:** ${res.location.type}
        **Longitude:** ${res.location.coordinates.longitude}
        **Latitude:** ${res.location.coordinates.latitude}
        `;

        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech CEP Search__')
            .setThumbnail(botImage)
            .addFields(
                { name: ':zap: **Main**', value: main, inline: true },
                { name: ':earth_americas: **Location**', value: location, inline: true }
            )
            .setFooter({ text: 'Powered by https://brasilapi.com.br' });

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Open location in Google Maps')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://www.google.com/maps/search/?api=1&query=${res.location.coordinates.latitude},${res.location.coordinates.longitude}`)
                    // '🌎' == :earth_americas:
                    .setEmoji('🌎')
            );

        await intr.reply({ embeds: [embed], components: [button] });
    },
};

export = cepSearch;