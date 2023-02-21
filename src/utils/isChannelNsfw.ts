import { ChannelType, ChatInputCommandInteraction } from 'discord.js';

export default function (intr: ChatInputCommandInteraction): boolean {
    if (intr.channel?.type === ChannelType.GuildText || intr.channel?.type === ChannelType.DM) {
        if (intr.channel.type === ChannelType.GuildText && !intr.channel.nsfw) {
            return false;
        }

        return true;
    }

    return false;
}