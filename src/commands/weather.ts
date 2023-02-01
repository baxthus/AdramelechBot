import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import config from '../config';

type ICep = ICep2[]

interface ICep2 {
    cep: string;
}

interface ICoord {
    cep: string;
    location: {
        coordinates: {
            longitude: string;
            latitude: string;
        }
    }
}

interface IWeather {
    weather: {
        main: string;
        description: string;
    }[]
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    }
    wind: {
        speed: number;
        deg: number;
        gust: number;
    }
    name: string;
}

export = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Replies with the weather in a given location (Brazil only)')
        .addStringOption(option =>
            option.setName('state')
                .setDescription('The state to get the weather for (sigla)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('city')
                .setDescription('The city to get the weather for')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('street')
                .setDescription('The street to get the weather for')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const state = interaction.options.getString('state');
        const city = interaction.options.getString('city');
        const street = interaction.options.getString('street');

        // get cep
        // that shit gave me a lot of headache
        const resCep: ICep = await (await fetch(`https://viacep.com.br/ws/${state}/${city}/${street}/json`)).json();
        if (resCep[0].cep === undefined) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red').setTitle('__Error! 1__'),
                ], ephemeral: true,
            });
        }

        // cep -> coordinates
        const resCoord: ICoord = await (await fetch(`https://brasilapi.com.br/api/cep/v2/${resCep[0].cep}`)).json();
        if (resCoord.cep === undefined) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red').setTitle('__Error! 2__'),
                ], ephemeral: true,
            });
        }

        // coordinates -> weather
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${resCoord.location.coordinates.latitude}&lon=${resCoord.location.coordinates.longitude}&appid=${config.bot.openWeatherKey}&units=metric&lang=pt_br`;
        const resWeather: IWeather = await (await fetch(url)).json();
        if (resWeather.name === undefined) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red').setTitle('__Error! 3__'),
                ], ephemeral: true,
            });
        }

        const mainField = `
        **Temperatura:** ${resWeather.main.temp}°C
        **Sensação Térmica:** ${resWeather.main.feels_like}°C
        **Temperatura Mínima:** ${resWeather.main.temp_min}°C
        **Temperatura Máxima:** ${resWeather.main.temp_max}°C
        **Pressão:** ${resWeather.main.pressure}hPa
        **Umidade:** ${resWeather.main.humidity}%
        **Nível do Mar:** ${resWeather.main.sea_level}hPa
        **Nível do Solo:** ${resWeather.main.grnd_level}hPa
        `;

        const weatherField = `
        **Tempo:** ${resWeather.weather[0].main}
        **Descrição:** ${resWeather.weather[0].description}
        `;

        const windField = `
        **Velocidade:** ${resWeather.wind.speed}m/s
        **Direção:** ${resWeather.wind.deg}°
        **Gusto:** ${resWeather.wind.gust}m/s
        `;

        const embed = new EmbedBuilder().setColor([203, 166, 247])
            .setTitle(`__Tempo em ${resWeather.name}__`)
            .addFields(
                {
                    name: '__Principal__',
                    value: mainField,
                },
                {
                    name: '__Vento__',
                    value: windField,
                    inline: true,
                },
                {
                    name: '__Tempo__',
                    value: weatherField,
                    inline: true,
                }
            );

        await interaction.reply({ embeds: [embed] });
    },
};