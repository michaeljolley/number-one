import { FaunaClient } from "./fauna";
import { Action, Credit, Sponsor, Stream, User } from "../../models";
import { LogLevel, log } from '../../common'

export abstract class Fauna {

  public static init(): void {
    FaunaClient.init()
  }

  public static async getUser(login: string): Promise<User | undefined> {
    let user: User

    try {
      user = await FaunaClient.getUser(login)
    }
    catch (err) {
      log(LogLevel.Error, err)
    }

    return user
  }

  public static async saveUser(user: User): Promise<User> {
    try {
      user = await FaunaClient.saveUser(user)
    }
    catch (err) {
      log(LogLevel.Error, err)
    }

    return user
  }

  public static async getStream(streamDate: string): Promise<Stream | undefined> {
    let stream: Stream

    try {
      stream = await FaunaClient.getStream(streamDate)
    }
    catch (err) {
      log(LogLevel.Error, err)
    }

    return stream
  }

  public static async saveStream(stream: Stream): Promise<Stream> {
    try {
      stream = await FaunaClient.saveStream(stream)
    }
    catch (err) {
      log(LogLevel.Error, err)
    }

    return stream
  }

  public static async getCredits(actionDate: string): Promise<[string[]] | undefined> {
    let actions: [string[]] | undefined;
    let sponsors: Sponsor[] | undefined;

    try {
      actions = await FaunaClient.getCredits(actionDate)
      sponsors = await FaunaClient.getSponsors();

      if (sponsors) {
        for (let i = 0; i < sponsors.length; i++) {
          const sponsor: Sponsor = sponsors[i];
          const user: User = await this.getUser(sponsor.displayName.toLocaleLowerCase());
          actions.push(['1/1/2020', sponsor.displayName, user.avatar_url, 'onSponsor']);
        }
      }

    }
    catch (err) {
      log(LogLevel.Error, err)
    }

    return actions
  }

  public static async getGivingActions(actionDate: string): Promise<Action[] | undefined> {
    let actions: Action[] | undefined

    try {
      actions = await FaunaClient.getGivingActions(actionDate)
    }
    catch (err) {
      log(LogLevel.Error, err)
    }

    return actions
  }


  public static async saveAction(action: Action): Promise<Action> {
    try {
      action = await FaunaClient.saveAction(action)
    }
    catch (err) {
      log(LogLevel.Error, err)
    }

    return action
  }
}