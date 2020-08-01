import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends a message to chat with details about sending stuff to BBB
 * @param onCommandEvent 
 */
export function POBox(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onCommandEvent.flags.broadcaster ||
    onCommandEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const message = `You can send candles, swag, art supplies (for the girls) to our PO Box: Bald. Bearded. Builder. PO Box 795, Odenville, AL 35120`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}