import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import config, { embedColor } from 'src/config';
import errorResponse from 'src/utils/errorResponse';

const dsnLookup: Command = {
    data: new SlashCommandBuilder()
        .setName('dnslookup')
        .setDescription('DNS Lookup for a domain')
        .addStringOption(option =>
            option.setName('domain')
                .setDescription('Domain that you want lookup')
                .setRequired(true)),
    async execute(intr) {
        const domain = intr.options.getString('domain');

        const res = await (await fetch(`https://da.gd/dns/${domain}`)).text();

        if (!res.replace('\n', '')) {
            await errorResponse(intr, 'Domain not found');
            return;
        }

        const file = new AttachmentBuilder(Buffer.from(res), { name: `${domain}.zone` });

        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech DNS Lookup__')
            .setThumbnail(config.bot.image)
            .addFields({
                name: ':link: **Domain**',
                value: `\`\`\`${domain}\`\`\``,
            });

        await intr.reply({ embeds: [embed], files: [file] });
    },
};

export default dsnLookup;