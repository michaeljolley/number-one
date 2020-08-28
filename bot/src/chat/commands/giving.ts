import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
import { ShouldThrottle } from '../shouldThrottle'

/**
 * Sends a message to chat with details about Backpack Buddies
 * @param onCommandEvent 
 */
export function Giving(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (!onCommandEvent.flags.broadcaster &&
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }

  const message = `The Bald Bearded Builder is currently supporting Backpack Buddies, helping feed underprivileged children who don't know where their next meal comes from. Please consider donating at http://bbb.dev/bpb and learning more about the charity at http://stclairbuddies.org`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}