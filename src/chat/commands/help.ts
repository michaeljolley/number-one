import { OnCommandEvent, OnSayEvent } from "../../models";
import { EventBus, Events } from "../../events";
import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { CommandRegistry } from "../commandRegistry";

interface AuthResult {
  data: {
    access_token: string
  }
}
/**
 * Sends a message to chat listing all available commands
 * @param onCommandEvent
 */
export async function Help(): Promise<void> {
  const commands = CommandRegistry.getCommands().map((c) => { return c.commandName}).join(', ')
  
  const message = `I can respond to the following commands: ${commands}`;

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message));
}
