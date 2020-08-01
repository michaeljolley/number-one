import { OnChatMessageEvent, OnStopEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends command to stop A/V effects
 * @param onChatMessageEvent 
 */
export function Stop(onChatMessageEvent: OnChatMessageEvent) {

  // Only the broadcaster & mods should be able to stop effects
  if (!onChatMessageEvent.flags.broadcaster &&
    !onChatMessageEvent.flags.mod) {
    return
  }

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnStop, new OnStopEvent())
}