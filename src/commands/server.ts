import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from 'src/config';

const server: Command = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Return server information'),
    async execute(intr) {
        const guildOwner = await intr.guild?.fetchOwner();

        const createdAt = Math.round(intr.guild?.createdTimestamp ?? 0 / 1000);

        const embed = new EmbedBuilder().setColor(embedColor)
            .setAuthor({
                name: intr.guild?.name ?? '',
                iconURL: intr.guild?.iconURL() ?? '',
            })
            .addFields(
                {
                    name: 'Server owner',
                    value: `${guildOwner?.user} (\`${guildOwner?.user.tag}\`)`,
                    inline: true,
                },
                {
                    name: 'Server ID',
                    value: intr.guild?.id ?? '',
                    inline: true,
                },
                {
                    name: 'Online members',
                    value: String(intr.guild?.members.cache.filter(member => member.presence?.status !== 'offline').size),
                },
                {
                    name: 'Server Boost status',
                    value: `${intr.guild?.premiumSubscriptionCount} Boosts (\`Level ${intr.guild?.premiumTier}\`)`,
                },
                {
                    name: 'Roles',
                    value: String(intr.guild?.roles.cache.size),
                    inline: true,
                },
                {
                    name: 'Channels',
                    value: String(intr.guild?.channels.cache.size),
                    inline: true,
                },
                {
                    name: 'Created',
                    value: `<t:${createdAt}:f> (<t:${createdAt}:R>)`,
                }
            );

        await intr.reply({ embeds: [embed] });
    },
};

export = server;