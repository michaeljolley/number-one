import { OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Sends a message to chat describing the Awesum.io project
 * @param onCommandEvent 
 */
export function Azure(): void {

  const message = `Azure is sponsoring today's stream. Let them know you appreciate their support of the BBB community by visiting https://bbb.dev/azure`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}