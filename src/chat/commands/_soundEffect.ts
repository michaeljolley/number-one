import fs from 'fs'
import { OnCommandEvent, OnSayEvent, OnSoundEffectEvent } from "../../models"
import { EventBus, Events } from "../../events"

/**
 * Determines if the command is an audio clip and attempts to play if so
 * @param onCommandEvent 
 */
export function _SoundEffect(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 60

  // The broadcaster & mods are allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onCommandEvent.flags.broadcaster ||
    onCommandEvent.flags.mod ||
    onCommandEvent.extra.sinceLastCommand.any < cooldownSeconds * 1000) {
    return
  }

  const filename = `${onCommandEvent.command.toLocaleLowerCase()}.mp3`
  const fullpath = `/overlays/wwwroot/assets/audio/clips/${filename}`

  if (fs.existsSync(fullpath)) {
    // Send a the sfx to Socket.io
    EventBus.eventEmitter.emit(Events.OnSoundEffect, new OnSoundEffectEvent(filename))
  }
}