import { FaunaClient } from "./fauna";
import { Action, Credit, Stream, User } from "../../models";
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

  public static async getCredits(actionDate: string): Promise<Credit[] | undefined> {
    let actions: Credit[] | undefined

    try {
      actions = await FaunaClient.getCredits(actionDate)
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