import { OnCommandEvent, OnStopEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends command to stop A/V effects
 * @param onCommandEvent 
 */
export function Stop(onCommandEvent: OnCommandEvent) {

  // Only the broadcaster & mods should be able to stop effects
  if (onCommandEvent.flags.broadcaster ||
    onCommandEvent.flags.mod) {
    // Send the message to Twitch chat
    EventBus.eventEmitter.emit(Events.OnStop, new OnStopEvent())
  }

}