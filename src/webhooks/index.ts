import express, { Request, Response } from 'express'
import { log, LogLevel } from '../common'
import { EventBus, Events } from '../events'
import { Twitch } from '../integrations'
import { OnRaidEvent, User } from '../models'

export const webhookRouter: express.Router = express.Router()

webhookRouter.get('/streamEvent', (request: Request, response: Response) => {

})

webhookRouter.get('/follow', (request: Request, response: Response) => {

})

webhookRouter.post('/raid', async (request: Request, response: Response) => {
  let { name, viewers } = request.body;
  name = name.toLocaleLowerCase();

  let userInfo: User
  try {
    userInfo = await Twitch.getUser(name)
  }
  catch (err) {
    log(LogLevel.Error, `webhooks: /raid - ${err}`)
  }

  emit(Events.OnRaid, new OnRaidEvent(userInfo, viewers))

  response.status(200).send();
})


const emit = (event: Events, payload: any) => {
  EventBus.eventEmitter.emit(event, payload)
}
