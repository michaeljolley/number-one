import { log, LogLevel } from "../common";
import { EventBus, Events } from "../events";
import { Fauna, Twitch } from "../integrations";
import {
  Credit,
  OnCheerEvent,
  OnCreditRollEvent,
  OnDonationEvent,
  OnPocketChangeEvent,
  OnStreamChangeEvent,
  OnStreamStartEvent,
  OnSubEvent,
  Stream
} from "../models";

export abstract class State {

  private static stream: Stream;
  private static amountGiven = 0;

  public static init(): void {
    EventBus.eventEmitter.addListener(Events.OnStreamChange,
      (onStreamChangeEvent: OnStreamChangeEvent) => this.onStreamChange(onStreamChangeEvent))
    EventBus.eventEmitter.addListener(Events.OnStreamEnd, () => this.onStreamEnd())
    EventBus.eventEmitter.addListener(Events.OnStreamStart,
      (onStreamStartEvent: OnStreamStartEvent) => this.onStreamStart(onStreamStartEvent))

    EventBus.eventEmitter.addListener(Events.OnCheer,
      (onCheerEvent: OnCheerEvent) => this.calcCheer(onCheerEvent));
    EventBus.eventEmitter.addListener(Events.OnDonation,
      (onDonationEvent: OnDonationEvent) => this.calcDonation(onDonationEvent));
    EventBus.eventEmitter.addListener(Events.OnSub,
      (onSubEvent: OnSubEvent) => this.calcSub(onSubEvent));

    EventBus.eventEmitter.addListener(Events.RequestCreditRoll,
      () => this.requestCreditRoll());
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
      this.stream = stream;
      await this.recalculateAmountGiven(this.stream.streamDate);
      return this.stream;
    }

    return undefined;
  }

  public static async getAmountGiven(): Promise<number> {
    if (!this.stream) {
      await this.getStream();
    }

    if (this.stream && this.amountGiven === 0) {
      this.recalculateAmountGiven(this.stream.streamDate);
    }

    return parseFloat(this.amountGiven.toFixed(2));
  }

  private static addAmountGiven(amount: number): number {
    this.amountGiven = this.amountGiven + amount;
    EventBus.eventEmitter.emit(Events.OnPocketChange, new OnPocketChangeEvent(this.amountGiven))
    return this.amountGiven;
  }

  private static async recalculateAmountGiven(streamDate: string): Promise<void> {
    try {
      const activities = await Fauna.getGivingActions(streamDate);

      for (const activity of activities) {
        switch (activity.eventType) {
          case 'onDonation':
            this.calcDonation(activity.eventData as OnDonationEvent);
            break;
          case 'onCheer':
            this.calcCheer(activity.eventData as OnCheerEvent);
            break;
          case 'onSub':
            this.calcSub(activity.eventData as OnSubEvent);
            break;
        }
      }
    } catch (err) {
      log(LogLevel.Error, `State: recalculateAmountGiven: ${err}`);
    }
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

  private static calcCheer(onCheerEvent: OnCheerEvent) {
    const amount = parseFloat((onCheerEvent.bits / 100).toFixed(2));
    this.addAmountGiven(amount);
  }
  private static calcSub(onSubEvent: OnSubEvent) {
    if (onSubEvent.subTierInfo && onSubEvent.subTierInfo.plan) {
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
  }
  private static calcDonation(onDonationEvent: OnDonationEvent) {
    this.addAmountGiven(onDonationEvent.amount);
  }

  private static async requestCreditRoll(): Promise<void> {
    try {
      if (!this.stream) {
        await this.getStream();
      }

      if (this.stream) {
        const actions: [string[]] = await Fauna.getCredits(this.stream.streamDate);

        const distinctCredits: Credit[] = [];
        
        const credits: Credit[] = actions.map((payload: string[]) => {
          return new Credit(payload[1], payload[2]);
        });

        credits.forEach((credit: Credit) => {
          if (!distinctCredits.find(f => f.displayName === credit.displayName)) {
            distinctCredits.push(credit);
          }
        });

        distinctCredits.forEach((credit) => {
          credit.onRaid = actions.some(a => a[1] === credit.displayName && a[3] === 'onRaid');
          credit.onCheer = actions.some(a => a[1] === credit.displayName && a[3] === 'onCheer');
          credit.onSub = actions.some(a => a[1] === credit.displayName && a[3] === 'onSub');
          credit.onDonation = actions.some(a => a[1] === credit.displayName && a[3] === 'onDonation');
          const sponsor = actions.find(a => a[1] === credit.displayName && a[3] === 'onSponsor');
          if (sponsor) {
            credit.onSponsor = true;
            credit.tier = parseInt(sponsor[4]);
          }
        });

        const onCreditRollEvent = new OnCreditRollEvent(distinctCredits);
        EventBus.eventEmitter.emit(Events.OnCreditRoll, onCreditRollEvent);
      }
    } catch (err) {
      log(LogLevel.Error, `State: requestCreditRoll: ${err}`);
    }
  }
}