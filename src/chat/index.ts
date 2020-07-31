import ComfyJS, { Extra, UserFlags } from 'comfy.js'
import { SubMethods } from 'tmi.js'

import { log, LogLevel } from '../common'
import { Config, OnChatMessageEvent, OnCheerEvent, OnRaidEvent, OnSubEvent, User, OnJoinEvent, OnPartEvent, Stream, OnPointRedemptionEvent, OnCommandEvent, OnStreamStartEvent, OnStreamEndEvent } from '../models'
import { EventBus, Events } from '../events'
import { Twitch } from '../integrations/twitch-api'

/**
 * ChatMonitor connects and monitors chat messages within Twitch
 */
export class ChatMonitor {

  constructor(private config: Config) {
    ComfyJS.onChat = this.onChat.bind(this)
    ComfyJS.onCheer = this.onCheer.bind(this)
    ComfyJS.onCommand = this.onCommand.bind(this)
    ComfyJS.onConnected = this.onConnected.bind(this)
    ComfyJS.onError = this.onError.bind(this)
    ComfyJS.onJoin = this.onJoin.bind(this)
    ComfyJS.onPart = this.onPart.bind(this)
    ComfyJS.onRaid = this.onRaid.bind(this)
    ComfyJS.onReconnect = this.onReconnect.bind(this)
    ComfyJS.onResub = this.onResub.bind(this)
    ComfyJS.onSub = this.onSub.bind(this)
    ComfyJS.onSubGift = this.onSubGift.bind(this)
    ComfyJS.onSubMysteryGift = this.onSubMysteryGift.bind(this)

    EventBus.eventEmitter.addListener(Events.OnStreamStart,
      (onStreamStartEvent: OnStreamStartEvent) => this.onStreamStart(onStreamStartEvent))
    EventBus.eventEmitter.addListener(Events.OnStreamEnd,
      (onStreamEndEvent: OnStreamEndEvent) => this.onStreamEnd(onStreamEndEvent))
  }

  private currentStream?: Stream

  /**
   * Initializes chat to connect to Twitch and begin listening
   */
  public init(): void {
    ComfyJS.Init(this.config.twitchBotUsername, this.config.twitchBotAuthToken, this.config.twitchChannelName)
  }

  private emit(event: Events, payload: any) {
    if (this.currentStream) {
      EventBus.eventEmitter.emit(event, payload)
    }
  }

  /**
   * Handler for each individual chat message
   * @param user 
   * @param message 
   * @param flags 
   * @param self 
   * @param extra 
   */
  private async onChat(user: string, message: string, flags: UserFlags, self: boolean, extra: Extra) {
    log(LogLevel.Info, `onChat: ${user}: ${message}`)
    if (!self) {
      let userInfo: User

      try {
        userInfo = await Twitch.getUser(user)
      }
      catch (err) {
        log(LogLevel.Error, `onChat: ${err}`)
      }

      if (userInfo) {
        this.emit(Events.OnChatMessage, new OnChatMessageEvent(userInfo, message, flags, self, extra))
        if (flags.customReward) {
          this.emit(Events.OnPointRedemption, new OnPointRedemptionEvent(userInfo, message, flags, self, extra))
        }
      }
    }
  }

  /**
   * Handler for cheers from Twitch
   * @param user 
   * @param message 
   * @param bits 
   * @param flags 
   * @param extra 
   */
  private async onCheer(user: string, message: string, bits: number, flags: UserFlags, extra: Extra) {
    log(LogLevel.Info, `onCheer: ${user} cheered ${bits} bits`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onCheer: ${err}`)
    }

    if (userInfo) {
      this.emit(Events.OnChatMessage, new OnCheerEvent(userInfo, message, bits, flags, extra))
    }
  }

  /**
   * Handler for chat messages that include commands
   * @param user 
   * @param command 
   * @param message 
   * @param flags 
   * @param extra 
   */
  private async onCommand(user: string, command: string, message: string, flags: UserFlags, extra: Extra) {
    log(LogLevel.Info, `onCommand: ${user} sent the ${command} command`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onCommand: getUser: ${err}`)
    }

    if (!this.currentStream) {
      let stream: Stream
      try {
        const streamDate = new Date().toLocaleDateString('en-US');
        stream = await Twitch.getStream(streamDate)
      }
      catch (err) {
        log(LogLevel.Error, `onCommand: getStream: ${err}`)
      }

      if (stream && !stream.ended_at) {
        this.currentStream = stream
      }
    }

    // Only respond to commands if we're streaming
    if (userInfo) {
      this.emit(Events.OnCommand, new OnCommandEvent(userInfo, command, message, flags, extra))
    }
  }

  /**
   * Handler for users joining Twitch chat
   * @param user 
   * @param self 
   */
  private async onJoin(user: string, self: boolean) {
    log(LogLevel.Info, `onJoin: ${user}`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onJoin: ${err}`)
    }

    if (userInfo) {
      this.emit(Events.OnJoin, new OnJoinEvent(userInfo, self))
    }
  }

  /**
   * Handler for users leaving Twitch chat
   * @param user 
   * @param self 
   */
  private async onPart(user: string, self: boolean) {
    log(LogLevel.Info, `onPart: ${user}`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onPart: ${err}`)
    }

    if (userInfo) {
      this.emit(Events.OnPart, new OnPartEvent(userInfo, self))
    }
  }

  /**
   * Handles event that fires upon connecting to Twitch chat
   * @param address 
   * @param port 
   * @param isFirstConnect 
   */
  private onConnected(address: string, port: number, isFirstConnect: boolean): void {
    log(LogLevel.Info, `onConnected: ${address}`)
  }

  /**
   * Handler for incoming raids
   * @param user 
   * @param viewers 
   */
  private async onRaid(user: string, viewers: number) {
    log(LogLevel.Info, `onRaid: ${user} raided with ${viewers} viewers`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onRaid: ${err}`)
    }

    if (userInfo) {
      this.emit(Events.OnRaid, new OnRaidEvent(userInfo, viewers))
    }
  }

  /**
   * Handler for reconnecting to Twitch chat
   * @param reconnectCount 
   */
  private onReconnect(reconnectCount: number): void {
    log(LogLevel.Info, `onReconnect: ${reconnectCount}`)
  }

  /**
   * Handler for new subscriptions
   * @param user 
   * @param message 
   * @param subTierInfo 
   * @param extra 
   */
  private async onSub(user: string, message: string, subTierInfo: SubMethods, extra: Extra) {
    log(LogLevel.Info, `onSub: ${user} subbed`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onSub: ${err}`)
    }

    if (userInfo) {
      this.emit(Events.OnSub, new OnSubEvent(userInfo, message, subTierInfo, extra))
    }
  }

  /**
   * Handler for newly gifted subscriptions
   * @param gifterUser 
   * @param streakMonths 
   * @param recipientUser 
   * @param senderCount 
   * @param subTierInfo 
   * @param extra 
   */
  private async onSubGift(gifterUser: string, streakMonths: number, recipientUser: string, senderCount: number, subTierInfo: SubMethods, extra: Extra) {
    log(LogLevel.Info, `onSubGift: ${gifterUser} gifted a sub to ${recipientUser}`)
    let userInfo: User
    let gifterInfo: User

    try {
      userInfo = await Twitch.getUser(recipientUser)
    }
    catch (err) {
      log(LogLevel.Error, `onSubGift: ${err}`)
    }

    try {
      gifterInfo = await Twitch.getUser(gifterUser)
    }
    catch (err) {
      log(LogLevel.Error, `onSubGift: ${err}`)
    }

    if (userInfo) {
      this.emit(Events.OnSub, new OnSubEvent(userInfo, '', subTierInfo, extra, null, gifterInfo))
    }
  }

  /**
   * Handler for renewals of subscriptions
   * @param user 
   * @param message 
   * @param streakMonths 
   * @param cumulativeMonths 
   * @param subTierInfo 
   * @param extra 
   */
  private async onResub(user: string, message: string, streakMonths: number, cumulativeMonths: number, subTierInfo: SubMethods, extra: Extra) {
    log(LogLevel.Info, `onResub: ${user} resubbed for ${cumulativeMonths} total months`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onResub: ${err}`)
    }

    if (userInfo) {
      this.emit(Events.OnSub, new OnSubEvent(userInfo, message, subTierInfo, extra, cumulativeMonths))
    }
  }

  /**
   * Handler for anonymously gifted subs
   * @param gifterUser 
   * @param numbOfSubs 
   * @param senderCount 
   * @param subTierInfo 
   * @param extra 
   */
  private onSubMysteryGift(gifterUser: string, numbOfSubs: number, senderCount: number, subTierInfo: SubMethods, extra: Extra): void {
    log(LogLevel.Info, `onSubMysteryGift: ${gifterUser} gifted ${numbOfSubs}`)
  }

  /**
   * Fires when a stream start event occurs 
   * @param onStreamStartEvent 
   */
  private onStreamStart(onStreamStartEvent: OnStreamStartEvent) {
    this.currentStream = onStreamStartEvent.stream
  }

  /**
   * Fires when a stream end event occurs 
   * @param onStreamEndEvent 
   */
  private onStreamEnd(onStreamEndEvent: OnStreamEndEvent) {
    this.currentStream = undefined
  }


  /**
   * Handler for errors in the Twitch client and/or connection
   * @param error 
   */
  private onError(error: any): void {
    log(LogLevel.Error, `onError: ${error}`)
  }
}
