import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
import { ShouldThrottle } from '../shouldThrottle'

/**
 * Sends a message to chat with backstory of the fart candle
 * @param onCommandEvent 
 */
export function Fart(onCommandEvent: OnCommandEvent) {

  const cooldownSeconds = 300

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (onCommandEvent.flags.broadcaster ||
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }

  const message = `A well known 'friend' of the stream sent us one of the stinkiest baldbeCandle candles they could find, it was that bad, @BaldBeardedBuilder had to drive home, windows rolled down to clear the smell out of his truck! On his 1 year streamaversary on 19th Jan 2020, he committed that for every 30 kids fed during a stream, via cheers, subs & donations, he will burn the candle live on stream for 15 mins in the name of charity (type !giving for more info, !pobox to find out how to send more candles)! Happy Virtual Candle Sniffing`

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}