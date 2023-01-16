import { ChatInputCommandInteraction, TextChannel } from 'discord.js';

export default function (interaction: ChatInputCommandInteraction) {
    // This is a horrible way to check the channel type, but works
    if (interaction.channel instanceof TextChannel) {
        if (!interaction.channel.nsfw) {
            return true;
        }

        return false;
    } else if (interaction.channel === null) {
        return false;
    } else {
        return true;
    }
}