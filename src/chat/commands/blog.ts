import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
import { ShouldThrottle } from '../shouldThrottle'

/**
 * Sends a message to chat with a link to Michael's blog
 * @param onCommandEvent 
 */
export function Blog(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onCommandEvent.flags.broadcaster ||
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }

  const message = `Mike's blog can be found at https://baldbeardedbuilder.com`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}