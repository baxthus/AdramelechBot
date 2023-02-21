import Command from '@interfaces/Command';
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { botImage, embedColor } from 'src/config';

const commandsField = `
**/avatar** - Return the selected user's avatar
**/ban** - Bans a member
**/cat** - Return a cat image
**/catboy** - Return a catboy image (SFW)
**/cep-search** - Search for CEP (Brazilian zip code)
**/clear** - Clear the messages
**/covid** - Return COVID stats
**/dnslookup** - DNS lookup for a domain
**/dog** - Return a dog image
**/feedback** - Share your feedback
**/github** - Get Github user or repository info
**/help** - Help, I need to say more?
**/kick** - Kicks a member
**/loli** - Return a loli image (NSFW)
**/lookup** - Lookup for a IP or a domain
**/neko** - Return a neko image
**/nsfw** - Return a NSFW image (NSFW)
**/obfuscator** - Obfuscate your URL
**/ping** - Replies with Pong!
**/send-dm** - DM a message (bot owner only)
**/server** - Return server information
**/short** - Short your URL
**/whois** - Whois a given domain or IP
**/yiff** - Return a yiff (furry porn) image (NSFW)
**/yiff2** - Return a yiff (furry porn) image (NSFW) (BETA)
`;

const help: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help, I need to say more?'),
    async execute(intr) {
        const embed = new EmbedBuilder().setColor(embedColor)
            .setTitle('__Adramelech Help Page__')
            .setThumbnail(botImage)
            .addFields({ name: '**__Commands__**', value: commandsField })
            .setFooter({ text: 'Created by Abysmal#1608', iconURL: 'https://abysmal.eu.org/avatar.png' });

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Author')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://abysmal.eu.org'),
                new ButtonBuilder()
                    .setLabel('Velocity')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('velocityButton'),
            );

        const buttons_end = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Author')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://abysmal.eu.org'),
                new ButtonBuilder()
                    .setLabel('Velocity')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('velocityButton')
                    .setDisabled(true),
            );

        await intr.reply({ embeds: [embed], components: [buttons] });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter = (i: any) => i.customId === 'velocityButton' && i.user.id === intr.user.id;
        const collector = intr.channel?.createMessageComponentCollector({ filter, time: 15000 });

        collector?.on('collect', async (i) => {
            // This is not the correct way to do it. Too bad.
            const startTime = performance.now();
            fetch('https://discord.com/api/v6');
            const endTime = performance.now();

            // https://stackoverflow.com/a/50075070
            const responseTime = String(endTime - startTime).replace(/\.(\d{1,2}).*$/, '.$1');

            const velocityEmbed = new EmbedBuilder().setColor([203, 166, 247])
                .setTitle('__Adramelech Velocity Test__')
                .setDescription(`Response time from our servers to Discord Endpoint is ${responseTime}ms`);

            await i.update({ embeds: [velocityEmbed] });
            return;
        });

        collector?.on('end', async () => {
            await intr.editReply({ embeds: [embed], components: [buttons_end] });
            return;
        });
    },
};

export = help;