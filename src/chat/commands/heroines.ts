import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
import { ShouldThrottle } from '../shouldThrottle'

/**
 * Sends a message to chat info on the Heroines of JavaScript
 * @param onCommandEvent 
 */
export function Heroines(onCommandEvent: OnCommandEvent):void {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (!onCommandEvent.flags.broadcaster &&
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }

  const message = `The Heroines of JavaScript cards are created by FrontEnd Foxes and support their scholarship fund. Lauryn (13) & Layla (10) interview a new heroine every other Sunday.  Check our events to catch the next one.  You can learn more at https://women-in-tech.online/ and https://frontendfoxes.org`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}