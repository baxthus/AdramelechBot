import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import config from 'src/config';

type ViacepType = Array<{
    cep?: string;
}>

interface IBrasilApi {
    cep?: string;
    location: {
        coordinates: {
            longitude: string;
            latitude: string;
        }
    }
}

interface IOpenWeather {
    weather: Array<{
        main: string
        description: string
    }>
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
    name?: string;
}

interface ILocation {
    state: string | null
    city: string | null
    street: string | null
}

const weather: Command = {
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
    async execute(intr) {
        const options: ILocation = {
            state: intr.options.getString('state'),
            city: intr.options.getString('city'),
            street: intr.options.getString('street'),
        };

        // get cep
        // that shit gave me a lot of headache
        const resCep: ViacepType = await (await fetch(`https://viacep.com.br/ws/${options.state}/${options.state}/${options.city}/json`)).json();
        if (resCep[0].cep === undefined) {
            await errorResponse(intr);
            return;
        }

        // cep -> coordinates
        const resCoord: IBrasilApi = await (await fetch(`https://brasilapi.com.br/api/cep/v2/${resCep[0].cep}`)).json();
        if (resCoord.cep === undefined) {
            await errorResponse(intr);
            return;
        }

        // coordinates -> weather
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${resCoord.location.coordinates.latitude}&lon=${resCoord.location.coordinates.longitude}&appid=${config.bot.openWeatherKey}&units=metric&lang=pt_br`;
        const resWeather: IOpenWeather = await (await fetch(url)).json();
        if (resWeather.name === undefined) {
            await errorResponse(intr);
            return;
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

        await intr.reply({
            embeds: [
                new EmbedBuilder().setColor(config.bot.embedColor)
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
                    ),
            ],
        });
    },
};

export default weather;