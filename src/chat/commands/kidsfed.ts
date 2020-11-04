import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
import { ShouldThrottle } from '../shouldThrottle'
import { State } from "../../state"

/**
 * Requests an update on how many kids were fed
 * @param onCommandEvent 
 */
export async function KidsFed(onCommandEvent: OnCommandEvent): Promise<void> {
  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (!onCommandEvent.flags.broadcaster &&
    !onCommandEvent.flags.mod &&
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }
  const amountGiven = await State.getAmountGiven();
  const kidsFed = Math.floor(amountGiven / 4);
  
  const message = `We've fed ${kidsFed} kid${(kidsFed !== 1) ? 's' : ''} on todays stream!`;
  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
  EventBus.eventEmitter.emit(Events.RequestGivingUpdate, null);
}