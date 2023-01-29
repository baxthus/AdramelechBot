import { ChatInputCommandInteraction, TextChannel } from 'discord.js';

// You should never encounter a situation in witch you want to edit this function.
// If you do, you are doing something wrong.
export default function (interaction: ChatInputCommandInteraction) {
    // I hate myself this is really stupid looking
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