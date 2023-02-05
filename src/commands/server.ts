import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { embedColor } from 'src/config';

export = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Return server information'),
    async execute(interaction: ChatInputCommandInteraction) {
        const guildOwner = await interaction.guild?.fetchOwner();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const createdAt = Math.round(interaction.guild!.createdTimestamp / 1000);

        const embed = new EmbedBuilder().setColor(embedColor)
            .setAuthor({
                name: interaction.guild?.name ?? '',
                iconURL: interaction.guild?.iconURL() ?? '',
            })
            .addFields(
                {
                    name: 'Server owner',
                    value: `${guildOwner?.user} (\`${guildOwner?.user.tag}\`)`,
                    inline: true,
                },
                {
                    name: 'Server ID',
                    value: String(interaction.guild?.id),
                    inline: true,
                },
                {
                    name: 'Online members',
                    value: String(interaction.guild?.members.cache.filter(member => member.presence?.status !== 'offline').size),
                },
                {
                    name: 'Server Boost status',
                    value: `${interaction.guild?.premiumSubscriptionCount} Boosts (\`Level ${interaction.guild?.premiumTier}\`)`,
                },
                {
                    name: 'Roles',
                    value: String(interaction.guild?.roles.cache.size),
                    inline: true,
                },
                {
                    name: 'Channels',
                    value: String(interaction.guild?.channels.cache.size),
                    inline: true,
                },
                {
                    name: 'Created',
                    value: `<t:${createdAt}:f> (<t:${createdAt}:R>)`,
                }
            );

        await interaction.reply({ embeds: [embed] });
    },
};