import { OnCommandEvent, OnSayEvent } from "../../models"
import { EventBus, Events } from "../../events"
import { ShouldThrottle } from '../shouldThrottle'

const messages = [
  "Protect your JavaScript, Android, or Kotlin application without performance impact with JSDefender. https://bbb.dev/js1 ",
  "JSDefender comes programmed with cutting-edge JavaScript obfuscation techniques with control-flow flattening, domain locking, and other in-app protection transforms. https://bbb.dev/js1 ",
  "JSDefender supports major JavaScript frameworks, runtimes, and bundlers including: Angular, Node, React, React Native, Webpack, and others. https://bbb.dev/js2 ",
  "Unlike other vendors that support application protection, the JSDefender application doesn’t require you to send your unprotected code. https://bbb.dev/js1 ",
  "JSDefender secures your JavaScript apps against tampering, misuse, and data theft using sophisticated obfuscation and active protection techniques. https://bbb.dev/js3 ",
  "JSDefender is available for evaluation or purchase and includes enterprise-grade protection, dedicated support, and commercial licensing. https://bbb.dev/js4 "
];

/**
 * Sends a message to chat about JSDefender
 * @param onCommandEvent 
 */
export function JSDefender(onCommandEvent: OnCommandEvent): void {

  const cooldownSeconds = 60

  // The broadcaster is allowed to bypass throttling. Otherwise,
  // only proceed if the command hasn't been used within the cooldown.
  if (!onCommandEvent.flags.broadcaster &&
    ShouldThrottle(onCommandEvent.extra.sinceLastCommand, cooldownSeconds, true)) {
    return
  }

  const message = messages[Math.floor(Math.random() * messages.length)];

  // Send the message to Twitch chat
  EventBus.eventEmitter.emit(Events.OnSay, new OnSayEvent(message))
}