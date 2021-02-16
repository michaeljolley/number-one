import { OnCommandEvent, OnSayEvent, OnSoundEffectEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Dispatches events to shame people for bad themes
 * @param onCommandEvent 
 */
export function Theme(onCommandEvent: OnCommandEvent):void {

  const user = onCommandEvent.user
  const incomingMessage = onCommandEvent.message

  const lowerMessage = incomingMessage.toLocaleLowerCase().trim()
  const words = lowerMessage.split(" ")
  const shamedThemes = [
    "hotdogstand",
    "hot dog stand",
    "lasers",
    "powershell",
    "bbbdark",
    "bbblight",
    "bbbgarish",
    "bbbphrakpanda",
    "bbbvue",
    "bbbpoo"
  ]

  if (words.length > 0 && shamedThemes.indexOf(words[0]) !== -1) {

    // dot_commie is the only viewer allowed to use
    // the lasers theme, so exit if the request came 
    // from him
    if (words[0] === 'lasers' &&
      user.login === 'dot_commie') {
      return
    }

    const username = user.display_name || user.login

    const message = `Shame on you @${username}! Who would choose a theme this bad!?`

    // Send the message to Twitch chat
    EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))

    // Send event to play shame sound effect
    EventBus.eventEmitter.emit(Events.OnSoundEffect, new OnSoundEffectEvent('shame.mp3'))
  }
}