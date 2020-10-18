import ComfyJS, { EmoteSet, OnCheerExtra, OnCheerFlags, OnCommandExtra, OnMessageExtra, OnMessageFlags, OnResubExtra, OnSubExtra, OnSubGiftExtra, OnSubMysteryGiftExtra } from 'comfy.js'
import { SubMethods } from 'tmi.js'

import { log, LogLevel } from '../common'
import { Config, OnChatMessageEvent, OnCheerEvent, OnRaidEvent, OnSubEvent, User, OnJoinEvent, OnPartEvent, OnPointRedemptionEvent, OnCommandEvent } from '../models'
import { EventBus, Events } from '../events'
import { Twitch } from '../integrations/twitch-api'
import { OnSayEvent } from '../models/OnSayEvent'
import { CommandMonitor } from './commandMonitor'
import sanitizeHtml from 'sanitize-html'
import { State } from '../state'

/**
 * ChatMonitor connects and monitors chat messages within Twitch
 */
export class ChatMonitor {

  commandMonitor: CommandMonitor

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

    EventBus.eventEmitter.addListener(Events.OnSay,
      (onSayEvent: OnSayEvent) => this.onSay(onSayEvent))

    this.commandMonitor = new CommandMonitor()
  }

  /**
   * Initializes chat to connect to Twitch and begin listening
   */
  public init(): void {
    ComfyJS.Init(this.config.twitchBotUsername, this.config.twitchBotAuthToken, this.config.twitchChannelName, (globalThis.loglevel === "development"))
  }

  public close(): void {
    ComfyJS.Disconnect()
  }

  private emit(event: Events, payload: unknown) {
    // if (this.currentStream) {
    EventBus.eventEmitter.emit(event, payload)
    // }
  }

  private onSay(onSayEvent: OnSayEvent) {
    ComfyJS.Say(onSayEvent.message, this.config.twitchChannelName)
  }

  /**
   * Handler for each individual chat message
   * @param user 
   * @param message 
   * @param flags 
   * @param self 
   * @param extra 
   */
  private async onChat(user: string, message: string, flags: OnMessageFlags, self: boolean, extra: OnMessageExtra) {
    log(LogLevel.Info, `onChat: ${user}: ${message}`)

    user = user.toLocaleLowerCase();

    if (!self
      && user !== process.env.TWITCH_BOT_USERNAME.toLocaleLowerCase()
      && user !== process.env.TWITCH_CHANNEL.toLocaleLowerCase()) {

      let userInfo: User

      try {
        userInfo = await Twitch.getUser(user)
      }
      catch (err) {
        log(LogLevel.Error, `onChat: ${err}`)
      }

      if (userInfo) {
        const processedChat = this.processChat(message, extra.messageEmotes);
        if (processedChat.message.length > 0) {
          this.emit(Events.OnChatMessage, new OnChatMessageEvent(userInfo, message, processedChat.message, flags, self, extra, extra.id, processedChat.emotes))
        }
        if (flags.customReward) {
          this.emit(Events.OnPointRedemption, new OnPointRedemptionEvent(userInfo, message, flags, self, extra))
        }
      }
    }
  }

  private processChat(message: string, messageEmotes?: EmoteSet) {
    let tempMessage: string = message.replace(/<img/gi, '<DEL');

    const emotes = [];

    // If the message has emotes, modify message to include img tags to the emote
    if (messageEmotes) {
      let emoteSet = [];

      for (const emote of Object.keys(messageEmotes)) {
        const emoteLocations = messageEmotes[emote];
        emoteLocations.forEach(location => {
          emoteSet.push(this.generateEmote(emote, location));
        });
      }

      // Order the emotes descending so we can iterate
      // through them with indexes
      emoteSet.sort((a, b) => {
        return b.end - a.end;
      });

      emoteSet.forEach(emote => {
        emotes.push(emote.emoteUrl);

        let emoteMessage = tempMessage.slice(0, emote.start);
        emoteMessage += emote.emoteImageTag;
        emoteMessage += tempMessage.slice(emote.end + 1, tempMessage.length);
        tempMessage = emoteMessage;
      });
    }

    tempMessage = sanitizeHtml(tempMessage, {
      allowedAttributes: {
        img: ['class',
          'src']
      },
      allowedTags: [
        'marquee',
        'em',
        'strong',
        'b',
        'i',
        'code',
        'strike',
        'blink',
        'img'
      ]
    });

    tempMessage = tempMessage.replace(/@(\w*)/gm, `<span>$&</span>`);

    return { message: tempMessage, emotes: emotes.map(m => m.emoteImageTag as string) };
  }

  private generateEmote(emoteId: string, position: string) {
    const [start, end] = position.split('-').map(Number);

    return {
      emoteId,
      emoteImageTag: `<img class='emote' src='https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0'/>`,
      emoteUrl: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`,
      start,
      end
    };
  }

  /**
   * Handler for cheers from Twitch
   * @param user 
   * @param message 
   * @param bits 
   * @param flags 
   * @param extra 
   */
  private async onCheer(user: string, message: string, bits: number, flags: OnCheerFlags, extra: OnCheerExtra) {
    log(LogLevel.Info, `onCheer: ${user} cheered ${bits} bits`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onCheer: ${err}`)
    }

    if (userInfo) {
      this.emit(Events.OnCheer, new OnCheerEvent(userInfo, message, bits, flags, extra))
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
  private async onCommand(user: string, command: string, message: string, flags: OnMessageFlags, extra: OnCommandExtra) {
    log(LogLevel.Info, `onCommand: ${user} sent the ${command} command`)
    let userInfo: User

    try {
      userInfo = await Twitch.getUser(user)
    }
    catch (err) {
      log(LogLevel.Error, `onCommand: getUser: ${err}`)
    }

    const stream = await State.getStream();

    // Only respond to commands if we're streaming, or debugging
    if (userInfo && (stream || process.env.NODE_ENV === "development")) {
      this.emit(Events.OnCommand, new OnCommandEvent(userInfo, command, message, flags, extra, stream));
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
    log(LogLevel.Info, `onConnected: ${address}:${port}`)
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
  private async onSub(user: string, message: string, subTierInfo: SubMethods, extra: OnSubExtra) {
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
  private async onSubGift(gifterUser: string, streakMonths: number, recipientUser: string, senderCount: number, subTierInfo: SubMethods, extra: OnSubGiftExtra) {
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
  private async onResub(user: string, message: string, streakMonths: number, cumulativeMonths: number, subTierInfo: SubMethods, extra: OnResubExtra) {
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
  private onSubMysteryGift(gifterUser: string, numbOfSubs: number, senderCount: number, subTierInfo: SubMethods, extra: OnSubMysteryGiftExtra): void {
    log(LogLevel.Info, `onSubMysteryGift: ${gifterUser} gifted ${numbOfSubs}`)
  }

  /**
   * Handler for errors in the Twitch client and/or connection
   * @param error 
   */
  private onError(error: any): void {
    log(LogLevel.Error, `onError: ${error}`)
  }
}
