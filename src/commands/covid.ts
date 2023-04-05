import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { botImage, embedColor } from '@config';
import errorResponse from '@utils/errorResponse';

interface ICovid {
    message?: string
    country?: string
    cases: string
    todayCases: string
    deaths: string
    todayDeaths: string
    recovered: string
    todayRecovered: string
}

const covid: Command = {
    data: new SlashCommandBuilder()
        .setName('covid')
        .setDescription('Return COVID stats')
        .addStringOption(option =>
            option.setName('country')
                .setDescription('This option can be \'worldwide\'')),
    uses: ['https://disease.sh'],
    async execute(intr) {
        const country = intr.options.getString('country') ?? 'worldwide';
        let res: ICovid;
        let local: string;

        if (country.toLowerCase() === 'worldwide') {
            res = await (await fetch('https://disease.sh/v3/covid-19/all')).json();
            local = country.toLowerCase();
        } else {
            res = await (await fetch(`https://disease.sh/v3/covid-19/countries/${country}`)).json();
            local = res.country ?? '';
        }

        if (res.message) {
            await errorResponse(intr, `\`${res.message}\``);
            return;
        }

        const message = `
        **Cases:** ${res.cases}
        **Today cases:** ${res.todayCases}
        **Deaths:** ${res.deaths}
        **Today deaths:** ${res.todayDeaths}
        **Recovered:** ${res.recovered}
        **Today recovered:** ${res.todayRecovered}
        `;

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(embedColor)
                    .setTitle(`__COVID stats in ${local}__`)
                    .setDescription(message)
                    .setThumbnail(botImage)
                    .setFooter({ text: 'Powered by https://disease.sh' }),
            ],
        });
    },
};

export = covid;