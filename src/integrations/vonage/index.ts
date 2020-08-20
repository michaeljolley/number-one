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
  IUserEvent, OnCommandEvent
} from '../../models'
import { EventBus, Events, Listener } from '../../events'
import { Twitch } from '../twitch-api'
import { VonageClient } from './vonageClient'
import { VonageMember, VonageConversation } from './models'
import { FaunaClient } from '../fauna/fauna'

export * from './vonageRouter'

export class Vonage {

  private _currentStream?: Stream
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
    new Listener<OnCommandEvent>(
      Events.OnCommand,
      (onCommandEvent: OnCommandEvent) =>
        this.sendEvent(Events.OnCommand, onCommandEvent)),
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
    VonageClient.init()

    for (const listener of this._listeners) {
      EventBus.eventEmitter.addListener(
        listener.type, listener.listener)
    }
  }

  private async streamStart(onStreamStartEvent: OnStreamStartEvent) {
    await this.initStream(onStreamStartEvent.stream)
  }

  private streamEnd(onStreamEndEvent: OnStreamEndEvent): void {
    this._currentStream = undefined
    this._members = []
  }

  private async sendEvent(type: Events, body: IUserEvent) {

    if (!this._currentStream) {
      const streamDate = new Date().toLocaleDateString('en-US')

      try {
        const stream = await Twitch.getStream(streamDate)
        if (stream) {
          await this.initStream(stream)
        }
      }
      catch (error) {
        log(LogLevel.Error, error)
      }
    }

    if (this._currentStream) {
      let user = body.user

      let member: VonageMember

      if (user) {
        member = this._members.find(m => m.user_id === user.vonageUserId)

        if (!member) {
          member = await VonageClient.createMember(this._currentStream.vonageConversationId, user.vonageUserId)
          if (member) {
            this._members.push(member)
          }
        }

        if (member) {
          VonageClient.sendEvent(this._currentStream.vonageConversationId, type, member.id, body)
        }
      }
    }
  }

  private async initStream(stream: Stream) {
    if (stream.vonageConversationId) {
      this._currentStream = stream
    }
    else {
      const dbStream = await FaunaClient.getStream(stream.streamDate)
      if (dbStream) {
        this._currentStream = dbStream
      }
      else {
        // Create a Vonage Conversation and associate it with the stream
        // and then save it to Fauna, like a boss
        const currentConversationId: string = await VonageClient.createConversation(stream.streamDate)
        if (currentConversationId) {
          stream.vonageConversationId = currentConversationId
          stream = await FaunaClient.saveStream(stream)
          this._currentStream = stream
        }
      }
    }

    const conversation: VonageConversation = await VonageClient.getConversation(this._currentStream.vonageConversationId)
    this._members = conversation.members
  }
}
