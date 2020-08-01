import { OnSayEvent, OnCommandEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends a message to chat re: what we're working on
 * @param onCommandEvent 
 */
export function Project(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onCommandEvent.flags.broadcaster ||
    onCommandEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const user = onCommandEvent.user
  const stream = onCommandEvent.stream
  const username = user.display_name || user.login

  const message = `@${username}, today's topic is: ${stream.title}`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}