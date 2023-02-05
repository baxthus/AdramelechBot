import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';
import config from 'src/config';

type ICep = {
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

type ICepError = {
    name: string;
    message: string;
    type: string;
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

        const content: ICep = res;

        const main = `
        **CEP:** ${content.cep}
        **State:** ${content.state}
        **City:** ${content.city}
        **Neighborhood:** ${content.neighborhood}
        **Street:** ${content.street}
        **Service:** ${content.service}
        `;

        const location = `
        **Type:** ${content.location.type}
        **Longitude:** ${content.location.coordinates.longitude}
        **Latitude:** ${content.location.coordinates.latitude}
        `;

        const embed = new EmbedBuilder().setColor(config.bot.embedColor)
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
                    .setURL(`https://www.google.com/maps/search/?api=1&query=${content.location.coordinates.latitude},${content.location.coordinates.longitude}`)
                    // "🌎" is the :earth_americas: emoji
                    .setEmoji('🌎'),
            );

        await interaction.reply({ embeds: [embed], components: [button] });
    },
};