import dotenv from 'dotenv'
dotenv.config()

import axios, { AxiosResponse } from 'axios'
import http from 'http'
import express from 'express'
import qs from 'querystring'

import { Config, TwitchTokenResponse } from './models'
import { ChatMonitor } from './chat'
import { webhookRouter } from './webhooks'
import { overlayRouter, assetsRouter } from './web'
import { log, LogLevel } from './common'
import { Fauna, Twitch } from './integrations'
import { IO } from './hub'
import { Cron } from './cron'
import { Logger } from './logger'
import StreamElements from './integrations/streamelements'
import { State } from './state'

// Identify the Twitch credentials first
const TWITCH_API = 'https://id.twitch.tv/oauth2/token'
const TwitchClientId = process.env.TWITCH_CLIENT_ID
const TwitchClientSecret = process.env.TWITCH_CLIENT_SECRET

const authParams = qs.stringify({
  client_id: TwitchClientId,
  client_secret: TwitchClientSecret,
  grant_type: 'client_credentials',
  scope: 'channel:moderate chat:edit chat:read'
})

axios.post(`${TWITCH_API}?${authParams}`)
  .then(init)
  .catch((reason: unknown) => log(LogLevel.Error, JSON.stringify(reason)))

async function init(response: AxiosResponse<TwitchTokenResponse>) {

  const twitchAuth = response.data
  const port = process.env.PORT

  const config: Config = new Config(
    TwitchClientId,
    process.env.TWITCH_CHANNEL,
    twitchAuth.access_token,
    process.env.TWITCH_BOT_USERNAME,
    process.env.TWITCH_BOT_AUTH_TOKEN,
    process.env.TWITCH_CHANNEL_ID,
    process.env.STREAM_ELEMENTS_JWT
  )

  const app = express()
  const server = http.createServer(app)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const streamElements = new StreamElements(config);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const io = new IO(server);

  Fauna.init()
  State.init()
  Logger.init()
  Twitch.init(config)
  Cron.init()

  await Twitch.registerWebhooks()

  app.use(express.json())

  app.use('/webhooks', webhookRouter)

  app.use('/overlays', overlayRouter)

  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    app.use('/overlays/assets', assetsRouter)
  }

  server.listen(port, () => {
    log(LogLevel.Info, `Server is listening on port ${port}`)
  })

  const chatMonitor: ChatMonitor = new ChatMonitor(config)

  chatMonitor.init()

  // close all streams and clean up anything needed for the stream
  // when the process is stopping
  process.on("SIGTERM", () => {
    log(LogLevel.Info, "Shutting down...")
    server.close()
    chatMonitor.close()
  })
}

