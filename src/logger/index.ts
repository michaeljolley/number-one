import { EventBus, Events } from '../events'
import { Fauna } from '../integrations'
import {
  OnChatMessageEvent,
  OnCheerEvent,
  OnDonationEvent,
  OnFollowEvent,
  OnStreamChangeEvent,
  OnStreamStartEvent,
  OnSubEvent,
  OnRaidEvent,
  Stream,
  Action
} from "../models"

let currentStream: Stream
let currentFundraising: number

export abstract class Logger {

  public static init(): void {

    EventBus.eventEmitter.addListener(Events.OnStreamChange,
      (onStreamChangeEvent: OnStreamChangeEvent) => this.onStreamChange(onStreamChangeEvent))
    EventBus.eventEmitter.addListener(Events.OnStreamEnd,
      () => this.onStreamEnd())
    EventBus.eventEmitter.addListener(Events.OnStreamStart,
      (onStreamStartEvent: OnStreamStartEvent) => this.onStreamStart(onStreamStartEvent))

    EventBus.eventEmitter.addListener(Events.OnChatMessage,
      (onChatMessageEvent: OnChatMessageEvent) => this.onChatMessage(onChatMessageEvent))
    EventBus.eventEmitter.addListener(Events.OnCheer,
      (onCheerEvent: OnCheerEvent) => this.onCheer(onCheerEvent))
    EventBus.eventEmitter.addListener(Events.OnDonation,
      (onDonationEvent: OnDonationEvent) => this.onDonation(onDonationEvent))
    EventBus.eventEmitter.addListener(Events.OnFollow,
      (onFollowEvent: OnFollowEvent) => this.onFollow(onFollowEvent))
    EventBus.eventEmitter.addListener(Events.OnSub,
      (onSubEvent: OnSubEvent) => this.onSub(onSubEvent))
    EventBus.eventEmitter.addListener(Events.OnRaid,
      (onRaidEvent: OnRaidEvent) => this.onRaid(onRaidEvent))
  }

  private static onChatMessage(onChatMessageEvent: OnChatMessageEvent) {
    Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onChatMessageEvent.user.id,
      onChatMessageEvent.user.display_name || onChatMessageEvent.user.login,
      onChatMessageEvent.user.avatar_url,
      Events.OnChatMessage,
      onChatMessageEvent
    ))
  }

  private static onCheer(onCheerEvent: OnCheerEvent) {
    Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onCheerEvent.user.id,
      onCheerEvent.user.display_name || onCheerEvent.user.login,
      onCheerEvent.user.avatar_url,
      Events.OnCheer,
      onCheerEvent
    ))
  }

  private static onDonation(onDonationEvent: OnDonationEvent) {
    if (onDonationEvent.twitchUser) {
      const user = onDonationEvent.twitchUser
      Fauna.saveAction(new Action(
        new Date().toLocaleDateString('en-US'),
        user.id,
        user.display_name || user.login,
        user.avatar_url,
        Events.OnDonation,
        onDonationEvent
      ))
    } else {
      Fauna.saveAction(new Action(
        new Date().toLocaleDateString('en-US'),
        '',
        onDonationEvent.user,
        '',
        Events.OnDonation,
        onDonationEvent
      ))
    }
  }

  private static onFollow(onFollowEvent: OnFollowEvent) {
    Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onFollowEvent.user.id,
      onFollowEvent.user.display_name || onFollowEvent.user.login,
      onFollowEvent.user.avatar_url,
      Events.OnFollow,
      onFollowEvent
    ))
  }

  private static onSub(onSubEvent: OnSubEvent) {
    Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onSubEvent.user.id,
      onSubEvent.user.display_name || onSubEvent.user.login,
      onSubEvent.user.avatar_url,
      Events.OnSub,
      onSubEvent
    ))
  }

  private static onRaid(onRaidEvent: OnRaidEvent) {
    Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onRaidEvent.user.id,
      onRaidEvent.user.display_name || onRaidEvent.user.login,
      onRaidEvent.user.avatar_url,
      Events.OnRaid,
      onRaidEvent
    ))
  }

  private static onStreamChange(onStreamChangeEvent: OnStreamChangeEvent) {
    if (!currentStream) {
      EventBus.eventEmitter.emit(Events.OnStreamStart, new OnStreamStartEvent(onStreamChangeEvent.stream))
    }
  }

  private static onStreamEnd() {
    currentStream = null
    currentFundraising = 0
  }

  private static onStreamStart(onStreamStartEvent: OnStreamStartEvent) {
    currentStream = onStreamStartEvent.stream
    currentFundraising = 0
  }

}