import { OnChatMessageEvent, OnSayEvent, OnSoundEffectEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Alerts the streamer to pay attention to chat
 * @param onChatMessageEvent 
 */
export function Attention(onChatMessageEvent: OnChatMessageEvent) {

  const cooldownSeconds = 120

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onChatMessageEvent.flags.broadcaster ||
    onChatMessageEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const user = onChatMessageEvent.user
  const username = user.display_name || user.login

  const message = `Yo @${onChatMessageEvent.extra.channel}, ${username} is trying to get your attention!`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))

  // Send a the sfx to Socket.io
  EventBus.eventEmitter.emit(Events.OnSoundEffect, new OnSoundEffectEvent('hailed.mp3'))
}