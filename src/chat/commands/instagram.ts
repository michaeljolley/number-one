import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends a message to chat with info on BBB Instagram
 * @param onCommandEvent 
 */
export function Instagram(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onCommandEvent.flags.broadcaster ||
    onCommandEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const message = `Watch pre-stream & post-stream videos and more. Follow us on Instagram at https://www.instagram.com/baldbeardedbuilder`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}