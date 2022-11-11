import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import config from '../config';

export = {
    data: new SlashCommandBuilder()
        .setName('covid')
        .setDescription('Return COVID stats')
        .addStringOption(option =>
            option.setName('country')
                .setDescription('This option can be "worldwide"')),
    async execute(interaction: ChatInputCommandInteraction) {
        const country = interaction.options.getString('country') ?? 'worldwide';
        let res;
        let local;

        if (country.toLowerCase() === 'worldwide') {
            res = await (await fetch('https://disease.sh/v3/covid-19/all')).json();
            local = country.toLowerCase();
        } else {
            res = await (await fetch(`https://disease.sh/v3/covid-19/countries/${country}`)).json();
            local = res.country;
        }

        if (res.message !== undefined) {
            return await interaction.reply({ embeds: [
                new EmbedBuilder().setColor('Red')
                    .setTitle('__Error!__')
                    .setDescription('`' + res.message + '`'),
            ], ephemeral: true });
        }

        const message = `
        **Cases:** ${res.cases}
        **Today cases:** ${res.todayCases}
        **Deaths:** ${res.deaths}
        **Today deaths:** ${res.todayDeaths}
        **Recovered:** ${res.recovered}
        **Today recovered:** ${res.todayRecovered}
        `;

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle(`__COVID stats in ${local}__`)
            .setDescription(message)
            .setThumbnail(config.bot.image)
            .setFooter({ text: 'Powered by https://disease.sh' });

        await interaction.reply({ embeds: [embed] });
    },
};