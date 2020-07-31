import { TwitchAPI } from './api'
import { User, Stream, Config } from '../../models'
import { Cache, CacheType } from '../../cache'
import { Fauna } from '../fauna'
import { LogLevel, log } from '../../common'

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
    let user: User = Cache.get(CacheType.User, login) as User | undefined

    if (!user && this.config) {
      let apiUser: User

      try {
        apiUser = await this.twitchAPI.getUser(login)
      }
      catch (err) {
        log(LogLevel.Error, `Twitch:getUser - API:getUser: ${err}`)
      }

      if (apiUser) {
        try {
          user = await Fauna.saveUser(apiUser)
          Cache.set(CacheType.User, user)
        }
        catch (err) {
          log(LogLevel.Error, `Twitch:getUser - fauna:saveUser: ${err}`)
        }
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
      let apiStream

      try {
        apiStream = await this.twitchAPI.getStream(streamDate)
      }
      catch (err) {
        log(LogLevel.Error, `Twitch:getStream - API:getStream: ${err}`)
        log(LogLevel.Error, err)
      }

      if (apiStream) {
        try {
          stream = await Fauna.saveStream(apiStream)
          Cache.set(CacheType.Stream, stream)
        }
        catch (err) {
          log(LogLevel.Error, `Twitch:getStream - fauna:saveStream: ${err}`)
        }
      }
    }

    return stream
  }
}