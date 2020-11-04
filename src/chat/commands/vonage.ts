import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
import { ShouldThrottle } from '../shouldThrottle'

/**
 * Sends a message to chat with details about Michael's Youtube
 * @param onCommandEvent 
 */
export function Vonage(onCommandEvent: OnCommandEvent): void {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (!onCommandEvent.flags.broadcaster &&
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }

  const message = `Michael is a Developer Advocate at Vonage. They have amazing communication API's that allow you to integrate SMS, Voice, Video and more into your application. Try it out for free at https://bbb.dev/vonage`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}