import { Client, CommandInteraction, Events } from 'discord.js';

interface Event {
    name: Events;
    once?: boolean;
    execute(arg: Client | CommandInteraction): Promise<void>
}

export default Event;