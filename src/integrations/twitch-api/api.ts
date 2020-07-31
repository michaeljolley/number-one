import axios, { AxiosResponse } from 'axios'
import { Config, Stream, User } from '../../models'
import { LogLevel, log } from '../../common';

export class TwitchAPI {

  private twitchAPIEndpoint: string = 'https://api.twitch.tv/helix'
  private twitchAPIUserEndpoint: string = `${this.twitchAPIEndpoint}/users`
  private twitchAPIStreamEndpoint: string = `${this.twitchAPIEndpoint}/streams`

  private headers: object

  constructor(private config: Config) {
    this.headers = {
      Authorization: `Bearer ${this.config.twitchChannelAuthToken}`,
      'Content-Type': 'application/json',
      'Client-ID': this.config.twitchClientId
    }
  }

  /**
   * Retrieves data regarding a Twitch user from the Twitch API
   * @param login username of the user to retrieve
   */
  public async getUser(login: string): Promise<User | undefined> {

    const url = `${this.twitchAPIUserEndpoint}?login=${login}`

    let user: User

    try {
      const response: AxiosResponse<any> = await axios.get(url, { headers: this.headers })
      if (response.data) {
        const body = response.data
        const userData = body.data.length > 1 ? body.data : body.data[0]
        if (userData) {
          user = new User(userData.login, userData.profile_image_url, userData.id, userData.display_name)
        }
      }
    } catch (err) {
      log(LogLevel.Error, `TwitchAPI:getUser ${err}`)
    }
    return user
  }

  public async getStream(streamDate: string): Promise<Stream | undefined> {

    const url = `${this.twitchAPIStreamEndpoint}?user_id=${this.config.twitchChannelId}&first=1`

    let stream: Stream

    try {
      const response: AxiosResponse<any> = await axios.get(url, { headers: this.headers })
      if (response.data) {
        const body = response.data
        const streamData = body.data.length > 1 ? body.data : body.data[0]
        if (streamData) {
          stream = new Stream(streamData.id, streamData.started_at, streamDate, streamData.title)
        }
      }
    } catch (err) {
      log(LogLevel.Error, `TwitchAPI:getStream ${err}`)
    }

    return stream
  }
}
