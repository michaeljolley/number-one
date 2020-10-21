import axios, { AxiosResponse } from 'axios'
import { Config, Stream, User } from '../../models'
import { LogLevel, log } from '../../common';
import { Guid } from "guid-typescript";
import * as Crypto from 'crypto';

export class TwitchAPI {

  private twitchAPIEndpoint = 'https://api.twitch.tv/helix'
  private twitchAPIUserEndpoint = `${this.twitchAPIEndpoint}/users`
  private twitchAPIStreamEndpoint = `${this.twitchAPIEndpoint}/streams`
  private twitchAPIWebhookEndpoint = `${this.twitchAPIEndpoint}/webhooks/hub`

  private headers: object
  private webhookSecret: string

  constructor(private config: Config) {
    this.headers = {
      Authorization: `Bearer ${this.config.twitchChannelAuthToken}`,
      'Content-Type': 'application/json',
      'Client-ID': this.config.twitchClientId
    }
  }

  /**
   * Registers all webhooks with Twitch directed to this instance of the bot
   */
  public async registerWebhooks(): Promise<void> {
    this.webhookSecret = Guid.create().toString();

    await this.registerFollowWebhook();
    await this.registerStreamWebhook();
  }

  private async registerFollowWebhook(): Promise<void> {
    try {
      const payload = {
        "hub.callback": `http://${process.env.HOST}/webhooks/follow`,
        "hub.mode": "subscribe",
        "hub.topic": `https://api.twitch.tv/helix/users/follows?first=1&to_id=${this.config.twitchChannelId}`,
        "hub.lease_seconds": 172800,
        "hub.secret": this.webhookSecret
      };

      const response = await axios.post(
        this.twitchAPIWebhookEndpoint,
        payload,
        {
          headers: this.headers
        });
      log(LogLevel.Info, `TwitchAPI:registerFollowWebhook - Response = ${response.status}`);
    } catch (err) {
      log(LogLevel.Error, `TwitchAPI:registerFollowWebhook ${err}`);
    }
  }

  private async registerStreamWebhook(): Promise<void> {
    try {
      const payload = {
        "hub.callback": `http://${process.env.HOST}/webhooks/stream`,
        "hub.mode": "subscribe",
        "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${this.config.twitchChannelId}`,
        "hub.lease_seconds": 172800,
        "hub.secret": this.webhookSecret
      };

      const response = await axios.post(
        this.twitchAPIWebhookEndpoint,
        payload,
        {
          headers: this.headers
        });
      log(LogLevel.Info, `TwitchAPI:registerStreamWebhook - Response = ${response.status}`);
    } catch (err) {
      log(LogLevel.Error, `TwitchAPI:registerStreamWebhook ${err}`);
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

  public validateWebhook(request, response, next): unknown {

    const givenSignature = request.headers['x-hub-signature'];

    if (!givenSignature) {
      log(LogLevel.Error, `webhooks: validator - missing signature`)
      return response.status(409).json({
        error: 'Missing signature'
      });
    }
    log(LogLevel.Error, `Twitch:hooks: ${JSON.stringify(givenSignature)}`)

    const digest = Crypto.createHmac('sha256', this.webhookSecret)
      .update(JSON.stringify(request.body))
      .digest('hex');
    log(LogLevel.Error, `Twitch:hooks: ${digest}`)

    if (givenSignature === `sha256=${digest}`) {
      return next();
    } else {
      log(LogLevel.Error, `webhooks: validator - invalid signature`)
      return response.status(409).json({
        error: 'Invalid signature'
      });
    }
  }
}
