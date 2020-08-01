import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
/**
 * Sends a message to chat with a link to the Fira Code
 * @param onCommandEvent 
 */
export function Discord(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onCommandEvent.flags.broadcaster ||
    onCommandEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const message = `Mike is using the Fira Code font.  You can find it at https://github.com/tonsky/FiraCode`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}