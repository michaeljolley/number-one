import throttledQueue from 'throttled-queue';
import { log, LogLevel } from '../common'
import { EventBus, Events } from '../events'
import { Fauna, Orbit } from '../integrations'
import {
  OnChatMessageEvent,
  OnCheerEvent,
  OnDonationEvent,
  OnFollowEvent,
  OnSubEvent,
  OnRaidEvent,
  Action,
  Activity,
  User
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
    EventBus.eventEmitter.addListener(Events.OnOrbit, (streamDate: string) => this.onOrbit(streamDate))
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
    const date = new Date()
    const streamDate = date.toLocaleDateString('en-US');

    await Fauna.saveAction(new Action(
      streamDate,
      onCheerEvent.user.id,
      onCheerEvent.user.display_name || onCheerEvent.user.login,
      onCheerEvent.user.avatar_url,
      Events.OnCheer,
      onCheerEvent
    ))
    await Orbit.addActivity(
      new Activity(
        'Cheered on Twitch',
        `Cheered ${onCheerEvent.bits} on Twitch`,
        'twitch:cheer',
        `twitch-cheer-${onCheerEvent.user.login}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`),
      onCheerEvent.user
    )
  }

  private static async onDonation(onDonationEvent: OnDonationEvent) {
    const date = new Date()
    const streamDate = date.toLocaleDateString('en-US');

    if (onDonationEvent.twitchUser) {
      const user = onDonationEvent.twitchUser
      await Fauna.saveAction(new Action(
        streamDate,
        user.id,
        user.display_name || user.login,
        user.avatar_url,
        Events.OnDonation,
        onDonationEvent
      ))

      await Orbit.addActivity(
        new Activity(
          'Donation on Twitch',
          `Donated ${onDonationEvent.amount} on Twitch`,
          'twitch:donation',
          `twitch-donation-${user.login}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`),
        onDonationEvent.twitchUser
      )
    } else {
      await Fauna.saveAction(new Action(
        streamDate,
        '',
        onDonationEvent.user,
        '',
        Events.OnDonation,
        onDonationEvent
      ))
    }
  }

  private static async onFollow(onFollowEvent: OnFollowEvent) {
    const date = new Date()
    const streamDate = date.toLocaleDateString('en-US');

    await Fauna.saveAction(new Action(
      streamDate,
      onFollowEvent.user.id,
      onFollowEvent.user.display_name || onFollowEvent.user.login,
      onFollowEvent.user.avatar_url,
      Events.OnFollow,
      onFollowEvent
    ))

    await Orbit.addActivity(
      new Activity(
        'Followed on Twitch',
        `Followed on Twitch`,
        'twitch:follow',
        `twitch-follow-${onFollowEvent.user.login}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`),
      onFollowEvent.user
    )
  }

  private static async onSub(onSubEvent: OnSubEvent) {
    const date = new Date()
    const streamDate = date.toLocaleDateString('en-US');

    await Fauna.saveAction(new Action(
      streamDate,
      onSubEvent.user.id,
      onSubEvent.user.display_name || onSubEvent.user.login,
      onSubEvent.user.avatar_url,
      Events.OnSub,
      onSubEvent
    ))

    await Orbit.addActivity(
      new Activity(
        'Subscribed on Twitch',
        `Subscribed on Twitch`,
        'twitch:subscribe',
        `twitch-subscribe-${onSubEvent.user.login}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`),
      onSubEvent.user
    )
  }

  private static async onRaid(onRaidEvent: OnRaidEvent) {
    const date = new Date()
    const streamDate = date.toLocaleDateString('en-US');

    await Fauna.saveAction(new Action(
      streamDate,
      onRaidEvent.user.id,
      onRaidEvent.user.display_name || onRaidEvent.user.login,
      onRaidEvent.user.avatar_url,
      Events.OnRaid,
      onRaidEvent
    ))

    await Orbit.addActivity(
      new Activity(
        'Raided on Twitch',
        `Raided with ${onRaidEvent.viewers} on Twitch`,
        'twitch:raid',
        `twitch-raid-${onRaidEvent.user.login}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`),
      onRaidEvent.user
    )
  }

  private static async onStreamEnd() {
    try {
      const stream = await Fauna.getStream(new Date().toLocaleDateString('en-US'));
      if (stream) {
        stream.ended_at = new Date().toISOString();
        await Fauna.saveStream(stream);
        EventBus.eventEmitter.emit(Events.OnOrbit, stream.streamDate);
      }
    }
    catch (err) {
      log(LogLevel.Error, `Logger: onStreamEnd: ${err}`);
    }
  }

  public static async onOrbit(streamDate: string): Promise<void> {
    try {
      const stream = await Fauna.getStream(streamDate)
      const date = new Date(streamDate)

      if (stream) {
        // Get all actions that occurred
        const actions = await Fauna.getAllActions(streamDate);

        // Aggregate actions
        const chatMessages = actions.filter(f => f[3] === 'onChatMessage');
        const uniqueChatters = chatMessages.map(m => m[1]).filter((v, i, s) => {
          return s.indexOf(v) === i;
        });

        // Store in Orbit
        const throttle = throttledQueue(120, 60 * 1000, true)

        throttle(async () => {
          for (const chatter of uniqueChatters) {
            await Orbit.addActivity(
              new Activity(
                'Chat on Twitch',
                `Chatted on Twitch`,
                'twitch:chat',
                `twitch-chat-${chatter}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                "0.2"),
              new User(chatter, '', '', chatter, date, '')
            )
          }
        })
      }
    } 
    catch (err) {
      log(LogLevel.Error, `Logger: onOrbit: ${err}`)
    }
  }
}