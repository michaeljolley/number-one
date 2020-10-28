import { OnSayEvent } from "../../models";
import { EventBus, Events } from "../../events";

import { CommandRegistry } from "../commandRegistry";

/**
 * Sends a message to chat listing all available commands
 * @param onCommandEvent
 */
export function Help(): void {
  const commands = CommandRegistry.getCommands().map((c) => { return `!${c.commandName}` }).join(', ')
  
  const message = `I can respond to the following commands: ${commands}`;

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message));
}
