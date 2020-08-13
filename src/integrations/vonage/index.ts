import Nexmo from 'nexmo'

import { log, LogLevel } from '../../common'
import {
  OnFollowEvent,
  OnCheerEvent,
  OnSubEvent,
  OnChatMessageEvent,
  OnDonationEvent,
  OnRaidEvent,
  OnPointRedemptionEvent,
  Stream,
  OnStreamStartEvent,
  OnStreamEndEvent,
  IUserEvent
} from '../../models'
import { EventBus, Events, Listener } from '../../events'
import { Twitch } from '../twitch-api'
import { VonageUser, VonageConversation, VonageMember } from './models'


export class Vonage {

  private _nexmoClient: any
  private _currentStream?: Stream
  private _currentConversationId?: string
  private _users: [VonageUser?] = []
  private _members: [VonageMember?] = []

  private _listeners: Array<Listener<any>> = [
    new Listener<OnChatMessageEvent>(
      Events.OnChatMessage,
      (onChatMessageEvent: OnChatMessageEvent) =>
        this.sendEvent(Events.OnChatMessage, onChatMessageEvent)
    ),
    new Listener<OnCheerEvent>(
      Events.OnCheer,
      (onCheerEvent: OnCheerEvent) =>
        this.sendEvent(Events.OnCheer, onCheerEvent)),
    new Listener<OnFollowEvent>(
      Events.OnFollow,
      (onFollowEvent: OnFollowEvent) =>
        this.sendEvent(Events.OnFollow, onFollowEvent)),
    new Listener<OnSubEvent>(
      Events.OnSub,
      (onSubEvent: OnSubEvent) =>
        this.sendEvent(Events.OnSub, onSubEvent)),
    new Listener<OnDonationEvent>(
      Events.OnDonation,
      (onDonationEvent: OnDonationEvent) =>
        this.sendEvent(Events.OnDonation, onDonationEvent)),
    new Listener<OnRaidEvent>(
      Events.OnRaid,
      (onRaidEvent: OnRaidEvent) =>
        this.sendEvent(Events.OnRaid, onRaidEvent)),
    new Listener<OnPointRedemptionEvent>(
      Events.OnPointRedemption,
      (onPointRedemptionEvent: OnPointRedemptionEvent) =>
        this.sendEvent(Events.OnPointRedemption, onPointRedemptionEvent)),
    new Listener<OnStreamStartEvent>(
      Events.OnStreamStart,
      (onStreamStartEvent: OnStreamStartEvent) =>
        this.streamStart(onStreamStartEvent)),
    new Listener<OnStreamEndEvent>(
      Events.OnStreamEnd,
      (onStreamEndEvent: OnStreamEndEvent) =>
        this.streamEnd(onStreamEndEvent)),
  ]

  constructor() {
    this._nexmoClient = new Nexmo({
      apiKey: process.env.NEXMO_API_KEY,
      apiSecret: process.env.NEXMO_API_SECRET,
      applicationId: process.env.NEXMO_APPLICATION_ID,
      privateKey: './private.key'
    })

    for (const listener of this._listeners) {
      EventBus.eventEmitter.addListener(
        listener.type, listener.listener)
    }
  }

  private streamStart(onStreamStartevent: OnStreamStartEvent): void {
    this._currentStream = onStreamStartevent.stream
    if (!this._currentConversationId) {
      this.getConversation()
      if (!this._currentConversationId) {
        this.createConversation()
      }
    }
  }

  private streamEnd(onStreamEndEvent: OnStreamEndEvent): void {
    this._currentStream = undefined
    this._currentConversationId = undefined
    this._users = []
    this._members = []
  }

  /**
   * Creates a new conversation to store data re: the stream
   */
  public createConversation() {
    try {
      this._nexmoClient.conversations.create({
        name: this._currentStream.streamDate,
        display_name: this._currentStream.streamDate
      }, (error, result) => {
        if (error) {
          if (error.body && error.body.description) {
            log(LogLevel.Error, `Vonage:createConversation - ${error.body.description}`)
          }
          else {
            log(LogLevel.Error, 'Vonage:createConversation - Something bad happened')
          }
        }
        else {
          console.log(JSON.stringify(result))
          const body = result.body
          this._currentConversationId = body.id
        }
      })
    }
    catch (err) {
      log(LogLevel.Error, `Nexmo:createConversation - ${err}`)
    }
  }

  public getConversation(): void {
    try {
      this._nexmoClient.conversations.get(this._currentStream.streamDate, (error, result) => {
        if (error) {
          if (error.body && error.body.description) {
            log(LogLevel.Error, `Vonage:getConversation - ${error.body.description}`)
          }
          else {
            log(LogLevel.Error, 'Vonage:getConversation - Something bad happened')
          }
        }
        else {
          console.log(JSON.stringify(result))
          const conversation: VonageConversation = result.body as VonageConversation
          this._currentConversationId = conversation.uuid
        }
      })
    }
    catch (error) {
      log(LogLevel.Error, error)
    }
  }

  private async sendEvent(type: Events, body: IUserEvent) {
    const streamDate = new Date().toLocaleDateString('en-US')

    if (!this._currentStream) {
      try {
        const stream = await Twitch.getStream(streamDate)
        if (stream) {
          this._currentStream = stream
        }
      }
      catch (error) {
        log(LogLevel.Error, error)
      }
    }

    if (this._currentStream) {

      if (!this._currentConversationId) {
        if (!this._currentConversationId) {
          this.getConversation()
          if (!this._currentConversationId) {
            this.createConversation()
          }
        }
      }

      if (this._currentConversationId) {



      }

    }

    if (this._currentConversation) {
      this._nexmoClient.conversations.events.create(this.streamDate, {
        "type": `custom:${type}`,
        "from": MEMBER_ID,
        body
      },
        (error, result) => {
          if (error) {
            console.error(error);
          } else {
            console.log(result);
          }
        });
    }
  }

  // Get Events by Type

}
