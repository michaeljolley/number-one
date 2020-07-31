import { User, Stream } from "../models"
import { CacheType } from "./cacheType"

export abstract class Cache {

  private static users: User[] = []
  private static streams: Stream[] = []

  public static get(cacheType: CacheType, identifier: string): object {
    switch (cacheType) {
      case CacheType.Stream:
        return this.streams.find(f => f.streamDate === identifier)
        break;
      case CacheType.User:
        return this.users.find(f => f.login === identifier)
        break;
    }
  }

  public static set(cacheType: CacheType, object: object): void {
    switch (cacheType) {
      case CacheType.Stream:
        let stream: Stream = object as Stream
        let newStreams = this.streams.filter(f => f.streamDate !== stream.streamDate)
        this.streams = [...newStreams, stream]
        break;
      case CacheType.User:
        let user: User = object as User
        let newUsers = this.users.filter(f => f.login !== user.login)
        this.users = [...newUsers, user]
        break;
    }
  }
}