import { FaunaClient } from "./fauna";
import { User } from "../../models";
import { LogLevel, log } from '../../common'

export abstract class Fauna {

  public static init() {
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
}