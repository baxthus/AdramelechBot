import { Client, Events, Interaction } from 'discord.js';

interface Event {
    name: Events;
    once?: boolean;
    execute(arg: Client | Interaction): Promise<void>
}

export default Event;