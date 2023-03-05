import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import config, { embedColor } from '@config';

// https://melvingeorge.me/blog/check-if-string-is-valid-ip-address-javascript
const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

interface IWhois {
    success: boolean;
    message?: string;
    type: string;
    continent: string;
    country: string;
    country_code: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
    postal: string;
    connection: {
        asn: number;
        org: string;
        isp: string;
        domain: string;
    };
    timezone: {
        id: string;
        offset: number;
        utc: string;
    };
}

const lookup: Command = {
    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Lookup for a ip or domain')
        .addStringOption(option =>
            option.setName('local')
                .setDescription('Address that you want to lookup (ip or domain)')
                .setRequired(true)),
    async execute(intr) {
        const userInput = intr.options.getString('local', true);
        let ip: string;

        // This is horrible
        if (regexExp.test(userInput)) {
            ip = userInput;
        } else {
            const getIp = (await (await fetch(`https://da.gd/host/${userInput}`)).text()).replace('\n', '');

            if (getIp.startsWith('No' || '')) {
                await errorResponse(intr, 'Error getting domain IP');
                return;
            }

            if (getIp.includes(',')) {
                // https://stackoverflow.com/a/9133209
                ip = getIp.substring(0, getIp.indexOf(','));
            } else {
                ip = getIp;
            }
        }

        const res: IWhois = await (await fetch(`https://ipwho.is/${ip}`)).json();

        if (!res.success) {
            await errorResponse(intr, `\`${res.message}\``);
            return;
        }

        const mainField = `
        **IP:** ${ip}
        **Domain:** ${(userInput !== ip) ? userInput : 'None'}
        **Type:** ${res.type}
        `;

        const locationField = `
        **Continent:** ${res.continent}
        **Country:** ${res.country} :flag_${res.country_code.toLowerCase()}:
        **Region:** ${res.region}
        **Latitude:** ${res.latitude}
        **Longitude:** ${res.longitude}
        **Postal:** ${res.postal}
        `;

        const connectionField = `
        **ASN:** ${res.connection.asn}
        **Org:** ${res.connection.org}
        **ISP:** ${res.connection.isp}
        `;

        const timezoneField = `
        **ID:** ${res.timezone.id}
        **UTC:** ${res.timezone.utc}
        **Offset:** ${res.timezone.offset}
        `;

        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech Lookup__')
            .setDescription('For best results search by ip')
            .setThumbnail(config.bot.image)
            .addFields(
                { name: ':zap: **Main**', value: mainField, inline: true },
                { name: ':earth_americas: **Location**', value: locationField, inline: true },
                { name: '\u200b', value: '\u200b' },
                { name: ':satellite: **Connection**', value: connectionField, inline: true },
                { name: ':clock1: **Timezone**', value: timezoneField, inline: true }
            )
            .setFooter({ text: 'Powered by https://ipwhois.io' });

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Open location in Google Maps')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://www.google.com/maps/search/?api=1&query=${res.latitude},${res.longitude}`)
                    // "🌎" is the :earth_americas: emoji
                    .setEmoji('🌎')
            );

        await intr.reply({ embeds: [embed], components: [button] });
    },
};

export = lookup;