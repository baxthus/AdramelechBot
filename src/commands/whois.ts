import Command from '@interfaces/Command';
import errorResponse from '@utils/errorResponse';
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import config from '../config';

const badStrings: Array<string> = [
    'Malformed',
    'Wrong',
    'The queried object does not',
    'Invalid',
    'No match',
    'Domain not',
    'NOT FOUND',
];

const whois: Command = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Whois a given domain or IP')
        .addStringOption(option =>
            option.setName('local')
                .setDescription('Domain or IP')
                .setRequired(true)),
    async execute(intr) {
        const local = intr.options.getString('local', true);

        const res = await (await fetch(`https://da.gd/w/${local}`)).text();

        if (badStrings.includes(res.replace('\n', ''))) {
            await errorResponse(intr);
            return;
        }

        const file = new AttachmentBuilder(Buffer.from(res), { name: `${local}.txt` });

        const embed = new EmbedBuilder().setColor(config.bot.embedColor)
            .setTitle('Adramelech Whois')
            .setThumbnail(config.bot.image)
            .addFields(
                {
                    name: ':link: **Domain/IP**',
                    value: `\`\`\`${local}\`\`\``,
                }
            )
            .setFooter({ text: 'Powered by https://da.gd' });

        await intr.reply({ embeds: [embed], files: [file] });
    },
};

export = whois;