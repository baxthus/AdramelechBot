import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';
import config from '../config';

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

        if (res.name !== undefined) {
            const errors = `**Name:** \`${res.name}\`\n**Message:** \`${res.message}\`\n**Type:** \`${res.type}\``;

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription(errors),
                ], ephemeral: true,
            });
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
                    .setURL(`https://www.google.com/maps/search/?api=1&query=${res.location.coordinates.latitude},${res.location.coordinates.longitude}`)
                    // "🗺️" is the map emoji
                    .setEmoji('🗺️'),
            );

        await interaction.reply({ embeds: [embed], components: [button] });
    },
};