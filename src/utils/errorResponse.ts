import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, InteractionResponse } from 'discord.js';

export default function (intr: ChatInputCommandInteraction | ButtonInteraction, desc?: string): Promise<InteractionResponse<boolean>> {
    return intr.reply({
        embeds: [
            new EmbedBuilder().setColor('Red')
                .setTitle('__Error!__')
                .setDescription(desc ? desc : null),
        ], ephemeral: true,
    });
}