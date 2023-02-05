import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';
import config from 'src/config';

export = {
    data: new SlashCommandBuilder()
        .setName('dnslookup')
        .setDescription('DNS Lookup for a domain')
        .addStringOption(option =>
            option.setName('domain')
                .setDescription('Domain that you want lookup')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const domain = interaction.options.getString('domain');

        const res = await (await fetch(`https://da.gd/dns/${domain}`)).text();

        if (!res.replace('\n', '')) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor('Red')
                        .setTitle('__Error!__')
                        .setDescription('Domain not found'),
                ], ephemeral: true,
            });
        }

        const file = new AttachmentBuilder(Buffer.from(res), { name: `${domain}.zone` });

        const embed = new EmbedBuilder().setColor(config.bot.embedColor)
            .setTitle('__Adramelech DNS Lookup__')
            .setThumbnail(config.bot.image)
            .addFields(
                {
                    name: ':link: **Domain**',
                    value: `\`\`\`${domain}\`\`\``,
                }
            )
            .setFooter({ text: 'Powered by https://da.gd' });

        await interaction.reply({ embeds: [embed], files: [file] });
    },
};
