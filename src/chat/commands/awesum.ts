import { OnChatMessageEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends a message to chat describing the Awesum.io project
 * @param onChatMessageEvent 
 */
export function Awesum(onChatMessageEvent: OnChatMessageEvent): void {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onChatMessageEvent.flags.broadcaster ||
    onChatMessageEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const message = `The Awesum.io project is a new way to spread the love and thank those who may have helped you - help brighten up their day by acknowledging how they've helped you. There is a short video introduction which can be found at https://www.twitch.tv/videos/523855530`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}