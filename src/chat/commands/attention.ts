import { OnCommandEvent, OnSayEvent, OnSoundEffectEvent } from '../../models'
import { EventBus, Events } from '../../events'
import { ShouldThrottle } from '../shouldThrottle'

/**
 * Alerts the streamer to pay attention to chat
 * @param onCommandEvent 
 */
export function Attention(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 120

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (!onCommandEvent.flags.broadcaster &&
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }

  const user = onCommandEvent.user
  const username = user.display_name || user.login

  const message = `Yo @${onCommandEvent.extra.channel}, ${username} is trying to get your attention!`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))

  // Send a the sfx to Socket.io
  EventBus.eventEmitter.emit(Events.OnSoundEffect, new OnSoundEffectEvent('hailed.mp3'))
}