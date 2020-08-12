import Nexmo from 'nexmo'

import { log, LogLevel } from '../../common'
import {
  OnFollowEvent,
  OnCheerEvent,
  OnSubEvent,
  OnChatMessageEvent,
  OnDonationEvent,
  OnRaidEvent,
  OnPointRedemptionEvent
} from '../../models'
import { EventBus, Events, Listener } from '../../events'

export class Vonage {

  private streamDate: string = '2020-08-12'

  private _nexmoClient: any
  private _currentConversation: any | undefined

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

  destroy() {
    for (const listener of this._listeners) {
      EventBus.eventEmitter.removeListener(
        listener.type,
        (arg: any) => listener.listener(arg))
    }
  }

  /**
   * Creates a new conversation to store data re: the stream
   * @param name Name of the conversation
   * @param displayname Display name of the conversation
   */
  public async createConversation(name: string, displayName: string): Promise<any> {
    let newConversation: any

    try {
      this._nexmoClient.conversations.create({
        name,
        display_name: displayName
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
          newConversation = result
        }
      })
    }
    catch (err) {
      log(LogLevel.Error, `Nexmo:createConversation - ${err}`)
    }
    return newConversation
  }

  public async getConversation(): any | undefined {

    try {
      this._nexmoClient.conversations.get(this.streamDate, (error, result) => {
        if (error) {
          if (error.body && error.body.description) {
            log(LogLevel.Error, `Vonage:getConversation - ${error.body.description}`)
          }
          else {
            log(LogLevel.Error, 'Vonage:getConversation - Something bad happened')
          }
        }
        else {
          this._currentConversation = result
        }
      })
    }
    catch (error) {
      log(LogLevel.Error, error)
    }
  }

  private async sendEvent(type: Events, body: any) {
    if (!this._currentConversation) {
      this._currentConversation = await this.createConversation(this.streamDate, this.streamDate)
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
