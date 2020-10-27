import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends a message to chat BBB Hype emotes
 * @param onCommandEvent 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Hype(onCommandEvent: OnCommandEvent):void {

  const message = `baldbeHype baldbeHype baldbeHype baldbeHype baldbeHype baldbeHype baldbeHype baldbeHype baldbeHype baldbeHype baldbeHype baldbeHype`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}