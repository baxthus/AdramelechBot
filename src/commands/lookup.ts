import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';
import config from '../config';

// https://melvingeorge.me/blog/check-if-string-is-valid-ip-address-javascript
const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

export = {
    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Lookup for a ip or domain')
        .addStringOption(option =>
            option.setName('local')
                .setDescription('Address that you want to lookup (ip or domain)')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const userInput = interaction.options.getString('local');
        let ip;

        // This is horrible
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (regexExp.test(userInput!)) {
            ip = userInput;
        } else {
            let getIp = await (await fetch(`https://da.gd/host/${userInput}`)).text();
            getIp = getIp.replace('\n', '');

            if (getIp.startsWith('No' || '')) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor('Red')
                            .setTitle('__Error!__')
                            .setDescription('Error getting domain IP'),
                    ], ephemeral: true,
                });
            }

            if (getIp.includes(',')) {
                // https://stackoverflow.com/a/9133209
                ip = getIp.substring(0, getIp.indexOf(','));
            } else {
                ip = getIp;
            }
        }

        const res = await (await fetch(`https://ipwho.is/${ip}`)).json();

        if (res.success !== true) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('`' + res.message + '`'),
                ], ephemeral: true,
            });
        }

        const main_field = `
        **IP:** ${ip}
        **Domain:** ${(userInput !== ip) ? userInput : 'None'}
        **Type:** ${res.type}
        `;

        const location_field = `
        **Continent:** ${res.continent}
        **Country:** ${res.country} :flag_${res.country_code.toLowerCase()}:
        **Region:** ${res.region}
        **Latitude:** ${res.latitude}
        **Longitude:** ${res.longitude}
        **Postal:** ${res.postal}
        `;

        const connection_field = `
        **ASN:** ${res.connection.asn}
        **Org:** ${res.connection.org}
        **ISP:** ${res.connection.isp}
        `;

        const timezone_field = `
        **ID:** ${res.timezone.id}
        **UTC:** ${res.timezone.utc}
        **Offset:** ${res.timezone.offset}
        `;

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle('__Adramelech Lookup__')
            .setDescription('For best results search by ip')
            .setThumbnail(config.bot.image)
            .addFields(
                {
                    name: ':zap: **Main**',
                    value: main_field,
                    inline: true,
                },
                {
                    name: ':earth_americas: **Location**',
                    value: location_field,
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                },
                {
                    name: ':satellite: **Connection**',
                    value: connection_field,
                    inline: true,
                },
                {
                    name: ':clock1: **Timezone**',
                    value: timezone_field,
                    inline: true,
                }
            )
            .setFooter({ text: 'Powered by https://ipwhois.io' });

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Open location in Google Maps')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://www.google.com/maps/search/?api=1&query=${res.latitude},${res.longitude}`)
                    // "🗺️" is the map emoji
                    .setEmoji('🗺️')
            );

        await interaction.reply({ embeds: [embed], components: [button] });
    },
};