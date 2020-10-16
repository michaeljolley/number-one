import { log, LogLevel } from "../common";
import { EventBus, Events } from "../events";
import { Twitch } from "../integrations";
import { OnCheerEvent, OnDonationEvent, OnStreamChangeEvent, OnStreamStartEvent, OnSubEvent, Stream } from "../models";

export abstract class State {

  private static stream: Stream;
  private static amountGiven: number;

  public static init(): void {
    EventBus.eventEmitter.addListener(Events.OnStreamChange,
      (onStreamChangeEvent: OnStreamChangeEvent) => this.onStreamChange(onStreamChangeEvent))
    EventBus.eventEmitter.addListener(Events.OnStreamEnd, () => this.onStreamEnd())
    EventBus.eventEmitter.addListener(Events.OnStreamStart,
      (onStreamStartEvent: OnStreamStartEvent) => this.onStreamStart(onStreamStartEvent))

    EventBus.eventEmitter.addListener(Events.OnCheer,
      (onCheerEvent: OnCheerEvent) => {
        const amount = parseFloat((onCheerEvent.bits / 100).toFixed(2));
        this.addAmountGiven(amount);
      });
    EventBus.eventEmitter.addListener(Events.OnDonation,
      (onDonationEvent: OnDonationEvent) => {
        this.addAmountGiven(onDonationEvent.amount);
      });
    EventBus.eventEmitter.addListener(Events.OnSub,
      (onSubEvent: OnSubEvent) => {
        if (onSubEvent.subTierInfo.plan) {
          let amount: number;
          switch (onSubEvent.subTierInfo.plan) {
            case "2000":
              amount = 5;
              break;
            case "3000":
              amount = 10;
              break;
            case "1000":
            case "Prime":
              amount = 2.5;
              break;
          }
          this.addAmountGiven(amount);
        }
      });
  }

  public static setStream(stream: Stream): void {
    this.stream = stream;
  }

  public static async getStream(): Promise<Stream | undefined> {

    if (this.stream) return this.stream;

    let stream: Stream
    try {
      const streamDate = new Date().toLocaleDateString('en-US')
      stream = await Twitch.getStream(streamDate)
    }
    catch (err) {
      log(LogLevel.Error, `onCommand: getStream: ${err}`)
    }

    if (stream && !stream.ended_at) {
      this.stream = stream
      return this.stream;
    }

    return undefined;
  }

  public static getAmountGiven(): number {
    return parseFloat(this.amountGiven.toFixed(2));
  }

  private static addAmountGiven(amount: number): number {
    this.amountGiven = this.amountGiven + amount;
    return this.amountGiven;
  }

  private static onStreamChange(onStreamChangeEvent: OnStreamChangeEvent): void {
    if (!this.stream) {
      EventBus.eventEmitter.emit(Events.OnStreamStart, new OnStreamStartEvent(onStreamChangeEvent.stream))
    } else {
      this.stream = onStreamChangeEvent.stream;
    }
  }

  private static onStreamEnd(): void {
    this.stream = undefined;
    this.amountGiven = 0;
  }

  private static onStreamStart(onStreamStartEvent: OnStreamStartEvent): void {
    this.stream = onStreamStartEvent.stream;
    this.amountGiven = 0;
  }
}