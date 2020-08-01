import { OnChatMessageEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
/**
 * Sends a message to chat with a link to the Family Friendly Live Twitch team
 * @param onChatMessageEvent 
 */
export function Discord(onChatMessageEvent: OnChatMessageEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onChatMessageEvent.flags.broadcaster ||
    onChatMessageEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const message = `Check out the entire Family Friendly Live team and give them all a follow at https://familyfriendly.live`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}