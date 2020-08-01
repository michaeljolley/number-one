import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends a message to chat re: the Live Coders team
 * @param onCommandEvent 
 */
export function LiveCoders(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onCommandEvent.flags.broadcaster ||
    onCommandEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const message = `Check out the entire Live Coders team and give them all a follow at https://livecoders.dev`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}