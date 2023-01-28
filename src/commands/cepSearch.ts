import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';
import config from '../config';

interface ICep {
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

interface ICepError {
    name: string;
    message: string;
    type: string;
    errors: {
        name: string;
        message: string;
        service: string;
    }[];
}

export = {
    data: new SlashCommandBuilder()
        .setName('cep-search')
        .setDescription('Search for CEP (Brazilian zip code)')
        .addStringOption(option =>
            option.setName('cep')
                .setDescription('CEP that you want search')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cep = interaction.options.getString('cep')!.replace('-', '');

        const res = await (await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)).json();

        if (res.name) {
            const resError: ICepError = res;
            const errors = `
            **Name:** \`${resError.name}\`
            **Message:** \`${resError.message}\`
            **Type:** \`${resError.type}\`
            `;

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription(errors),
                ], ephemeral: true,
            });
        }

        const result: ICep = res;

        const main = `
        **CEP:** ${result.cep}
        **State:** ${result.state}
        **City:** ${result.city}
        **Neighborhood:** ${result.neighborhood}
        **Street:** ${result.street}
        **Service:** ${result.service}
        `;

        const location = `
        **Type:** ${result.location.type}
        **Longitude:** ${result.location.coordinates.longitude}
        **Latitude:** ${result.location.coordinates.latitude}
        `;

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle('__Adramelech CEP Search__')
            .setThumbnail(config.bot.image)
            .addFields(
                {
                    name: ':zap: **Main**',
                    value: main,
                    inline: true,
                },
                {
                    name: ':earth_americas: **Location**',
                    value: location,
                    inline: true,
                },
            )
            .setFooter({ text: 'Powered by https://brasilapi.com.br' });

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Open location in Google Maps')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://www.google.com/maps/search/?api=1&query=${result.location.coordinates.latitude},${result.location.coordinates.longitude}`)
                    // "🌎" is the :earth_americas: emoji
                    .setEmoji('🌎'),
            );

        await interaction.reply({ embeds: [embed], components: [button] });
    },
};