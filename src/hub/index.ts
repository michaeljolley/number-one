import io, { Server as IOServer } from "socket.io"
import { Server as HttpServer } from 'http'

import { EventBus, Events } from '../events'
import {
  OnChatMessageEvent,
  OnCheerEvent,
  OnCreditRollEvent,
  OnDonationEvent,
  OnFollowEvent,
  OnJoinEvent,
  OnPartEvent,
  OnSoundEffectEvent,
  OnStopEvent,
  OnStreamEndEvent,
  OnStreamStartEvent,
  OnSubEvent,
  OnRaidEvent,
  OnPointRedemptionEvent,
  OnPocketChangeEvent,
} from "../models"
import { OnStreamChangeEvent } from "../models/OnStreamChangeEvent"

export class IO {

  private io: IOServer

  constructor(server: HttpServer) {
    this.io = io(server)

    this.io.on('connect', (conn: io.Socket) => {

      conn.on('requestCreditRoll', () => this.requestCreditRoll());

      // Ensure the connection is from the bots overlays and not
      // and external actor.
      if (conn.handshake.headers.host !== process.env.HOST &&
        conn.handshake.headers.host !== `${process.env.HOST}:${process.env.PORT}`) {
        conn.disconnect(true)
      }
    })

    EventBus.eventEmitter.addListener(Events.OnChatMessage,
      (onChatMessageEvent: OnChatMessageEvent) => this.onChatMessage(onChatMessageEvent))
    EventBus.eventEmitter.addListener(Events.OnCheer,
      (onCheerEvent: OnCheerEvent) => this.onCheer(onCheerEvent))
    EventBus.eventEmitter.addListener(Events.OnCreditRoll,
      (onCreditRoll: OnCreditRollEvent) => this.onCreditRoll(onCreditRoll))
    EventBus.eventEmitter.addListener(Events.OnDonation,
      (onDonationEvent: OnDonationEvent) => this.onDonation(onDonationEvent))
    EventBus.eventEmitter.addListener(Events.OnFollow,
      (onFollowEvent: OnFollowEvent) => this.onFollow(onFollowEvent))
    EventBus.eventEmitter.addListener(Events.OnJoin,
      (onJoinEvent: OnJoinEvent) => this.onJoin(onJoinEvent))
    EventBus.eventEmitter.addListener(Events.OnPart,
      (onPartEvent: OnPartEvent) => this.onPart(onPartEvent))
    EventBus.eventEmitter.addListener(Events.OnPointRedemption,
      (onPointRedemptionEvent: OnPointRedemptionEvent) => this.onPointRedemption(onPointRedemptionEvent))
    EventBus.eventEmitter.addListener(Events.OnSoundEffect,
      (onSoundEffectEvent: OnSoundEffectEvent) => this.onSoundEffect(onSoundEffectEvent))
    EventBus.eventEmitter.addListener(Events.OnStop,
      (onStopEvent: OnStopEvent) => this.onStop(onStopEvent))
    EventBus.eventEmitter.addListener(Events.OnStreamChange,
      (onStreamChangeEvent: OnStreamChangeEvent) => this.onStreamChange(onStreamChangeEvent))
    EventBus.eventEmitter.addListener(Events.OnStreamEnd,
      (onStreamEndEvent: OnStreamEndEvent) => this.onStreamEnd(onStreamEndEvent))
    EventBus.eventEmitter.addListener(Events.OnStreamStart,
      (onStreamStartEvent: OnStreamStartEvent) => this.onStreamStart(onStreamStartEvent))
    EventBus.eventEmitter.addListener(Events.OnSub,
      (onSubEvent: OnSubEvent) => this.onSub(onSubEvent))
    EventBus.eventEmitter.addListener(Events.OnRaid,
      (onRaidEvent: OnRaidEvent) => this.onRaid(onRaidEvent))
    EventBus.eventEmitter.addListener(Events.OnPocketChange,
      (onPocketChangeEvent: OnPocketChangeEvent) => this.onPocketChangeEvent(onPocketChangeEvent))

    EventBus.eventEmitter.addListener(Events.RequestGivingUpdate,
      () => this.requestGivingUpdate())
    EventBus.eventEmitter.addListener(Events.RequestCreditRoll,
      () => this.requestCreditRoll())
  }

  private onChatMessage(onChatMessageEvent: OnChatMessageEvent) {
    this.io.emit(Events.OnChatMessage, onChatMessageEvent)
  }

  private onCheer(onCheerEvent: OnCheerEvent) {
    this.io.emit(Events.OnCheer, onCheerEvent)
  }

  private onCreditRoll(onCreditRollEvent: OnCreditRollEvent) {
    this.io.emit(Events.OnCreditRoll, onCreditRollEvent)
  }

  private onDonation(onDonationEvent: OnDonationEvent) {
    this.io.emit(Events.OnDonation, onDonationEvent)
  }

  private onFollow(onFollowEvent: OnFollowEvent) {
    this.io.emit(Events.OnFollow, onFollowEvent)
  }

  private onJoin(onJoinEvent: OnJoinEvent) {
    this.io.emit(Events.OnJoin, onJoinEvent)
  }

  private onPart(onPartEvent: OnPartEvent) {
    this.io.emit(Events.OnPart, onPartEvent)
  }

  private onPointRedemption(onPointRedemptionEvent: OnPointRedemptionEvent) {
    this.io.emit(Events.OnPointRedemption, onPointRedemptionEvent)
  }

  private onSoundEffect(onSoundEffectEvent: OnSoundEffectEvent) {
    this.io.emit(Events.OnSoundEffect, onSoundEffectEvent)
  }

  private onStop(onStopEvent: OnStopEvent) {
    this.io.emit(Events.OnStop, onStopEvent)
  }

  private onStreamChange(onStreamChangeEvent: OnStreamChangeEvent) {
    this.io.emit(Events.OnStreamChange, onStreamChangeEvent)
  }

  private onStreamEnd(onStreamEndEvent: OnStreamEndEvent) {
    this.io.emit(Events.OnStreamEnd, onStreamEndEvent)
  }

  private onStreamStart(onStreamStartEvent: OnStreamStartEvent) {
    this.io.emit(Events.OnStreamStart, onStreamStartEvent)
  }

  private onSub(onSubEvent: OnSubEvent) {
    this.io.emit(Events.OnSub, onSubEvent)
  }

  private onRaid(onRaidEvent: OnRaidEvent) {
    this.io.emit(Events.OnRaid, onRaidEvent)
  }

  private onPocketChangeEvent(onPocketChangeEvent: OnPocketChangeEvent) {
    this.io.emit(Events.OnPocketChange, onPocketChangeEvent);
  }

  private requestCreditRoll() {
    this.io.emit(Events.RequestCreditRoll);
  }
  private requestGivingUpdate() {
    this.io.emit(Events.RequestGivingUpdate);
  }
}