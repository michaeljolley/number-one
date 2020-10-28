import { log, LogLevel } from '../common'
import { EventBus, Events } from '../events'
import { Fauna } from '../integrations'
import {
  OnChatMessageEvent,
  OnCheerEvent,
  OnDonationEvent,
  OnFollowEvent,
  OnSubEvent,
  OnRaidEvent,
  Action
} from "../models"


export abstract class Logger {

  public static init(): void {
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
    EventBus.eventEmitter.addListener(Events.OnStreamEnd, () => this.onStreamEnd())
  }

  private static async onChatMessage(onChatMessageEvent: OnChatMessageEvent) {
    await Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onChatMessageEvent.user.id,
      onChatMessageEvent.user.display_name || onChatMessageEvent.user.login,
      onChatMessageEvent.user.avatar_url,
      Events.OnChatMessage,
      onChatMessageEvent
    ))
  }

  private static async onCheer(onCheerEvent: OnCheerEvent) {
    await Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onCheerEvent.user.id,
      onCheerEvent.user.display_name || onCheerEvent.user.login,
      onCheerEvent.user.avatar_url,
      Events.OnCheer,
      onCheerEvent
    ))
  }

  private static async onDonation(onDonationEvent: OnDonationEvent) {
    if (onDonationEvent.twitchUser) {
      const user = onDonationEvent.twitchUser
      await Fauna.saveAction(new Action(
        new Date().toLocaleDateString('en-US'),
        user.id,
        user.display_name || user.login,
        user.avatar_url,
        Events.OnDonation,
        onDonationEvent
      ))
    } else {
      await Fauna.saveAction(new Action(
        new Date().toLocaleDateString('en-US'),
        '',
        onDonationEvent.user,
        '',
        Events.OnDonation,
        onDonationEvent
      ))
    }
  }

  private static async onFollow(onFollowEvent: OnFollowEvent) {
    await Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onFollowEvent.user.id,
      onFollowEvent.user.display_name || onFollowEvent.user.login,
      onFollowEvent.user.avatar_url,
      Events.OnFollow,
      onFollowEvent
    ))
  }

  private static async onSub(onSubEvent: OnSubEvent) {
    await Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onSubEvent.user.id,
      onSubEvent.user.display_name || onSubEvent.user.login,
      onSubEvent.user.avatar_url,
      Events.OnSub,
      onSubEvent
    ))
  }

  private static async onRaid(onRaidEvent: OnRaidEvent) {
    await Fauna.saveAction(new Action(
      new Date().toLocaleDateString('en-US'),
      onRaidEvent.user.id,
      onRaidEvent.user.display_name || onRaidEvent.user.login,
      onRaidEvent.user.avatar_url,
      Events.OnRaid,
      onRaidEvent
    ))
  }

  private static async onStreamEnd() {
    try {
      const stream = await Fauna.getStream(new Date().toLocaleDateString('en-US'));
      if (stream) {
        stream.ended_at = new Date().toISOString();
        await Fauna.saveStream(stream);
      }
    }
    catch (err) {
      log(LogLevel.Error, `Logger: onStreamEnd: ${err}`);
    }
  }
}