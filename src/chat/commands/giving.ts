import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
import { ShouldThrottle } from '../shouldThrottle'

/**
 * Sends a message to chat with details about Backpack Buddies
 * @param onCommandEvent 
 */
export function Giving(onCommandEvent: OnCommandEvent): void {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cool down.
  if (!onCommandEvent.flags.broadcaster &&
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }

  const message = `The BBB community is very active in giving to organizations like Backpack Buddies, Girls Who Code, and St. Judes Childrens Hospital. In addition, we sponsor underrepresented groups to attend various conferences & workshops.`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}