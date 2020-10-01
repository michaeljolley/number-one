import { TwitchAPI } from './api'
import { User, Stream, Config } from '../../models'
import { Cache, CacheType } from '../../cache'
import { LogLevel, log } from '../../common'
import { Fauna } from '../fauna'

export abstract class Twitch {

  private static config: Config
  private static twitchAPI: TwitchAPI

  public static init(config: Config) {
    this.config = config
    this.twitchAPI = new TwitchAPI(config)
  }

  /**
   * Attempts to retrieve a user from the cache and, if needed, the Twitch API
   * @param login Twitch login of user to retrieve
   */
  public static async getUser(login: string): Promise<User | undefined> {
    login = login.toLocaleLowerCase()

    let user: User = Cache.get(CacheType.User, login) as User | undefined

    if (!user) {

      try {
        user = await Fauna.getUser(login)
      }
      catch (err) {
        log(LogLevel.Error, `Twitch:getUser - Fauna:getUser: ${err}`)
      }

      var date = new Date();
      date.setDate(date.getDate() - 1);

      if (!user ||
        (!user.lastUpdated || user.lastUpdated < date)) {
        let apiUser: User
        try {
          apiUser = await this.twitchAPI.getUser(login)
        }
        catch (err) {
          log(LogLevel.Error, `Twitch:getUser - API:getUser: ${err}`)
        }

        if (apiUser) {
          user = await Fauna.saveUser(apiUser)
        }
      }
      if (user) {
        Cache.set(CacheType.User, user)
      }
    }

    return user
  }

  /**
   * Attempts to retrieve a stream from the cache and, if needed, the Twitch API
   * @param streamDate Date the stream started on
   */
  public static async getStream(streamDate: string): Promise<Stream | undefined> {
    let stream: Stream = Cache.get(CacheType.Stream, streamDate) as Stream | undefined

    if (!stream && this.config) {
      try {
        stream = await this.twitchAPI.getStream(streamDate)
      }
      catch (err) {
        log(LogLevel.Error, `Twitch:getStream - API:getStream: ${err}`)
        log(LogLevel.Error, err)
      }

      if (stream) {
        Cache.set(CacheType.Stream, stream)
      }
    }

    return stream
  }
}