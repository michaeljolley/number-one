import express, { Request, Response } from 'express'
import { log, LogLevel } from '../common'
import { EventBus, Events } from '../events'
import { Twitch } from '../integrations'
import { OnCheerEvent, OnDonationEvent, OnFollowEvent, OnRaidEvent, OnSubEvent, User } from '../models'

export const webhookRouter: express.Router = express.Router()

webhookRouter.get('/streamEvent', (request: Request, response: Response) => {

})

webhookRouter.get('/follow', (request: Request, response: Response) => {

})

webhookRouter.post('/test/raid', async (request: Request, response: Response) => {
  let { name, viewers } = request.body;
  name = name.toLocaleLowerCase();

  let userInfo: User
  try {
    userInfo = await Twitch.getUser(name)
  }
  catch (err) {
    log(LogLevel.Error, `webhooks: /test/raid - ${err}`)
  }

  emit(Events.OnRaid, new OnRaidEvent(userInfo, viewers))

  response.status(200).send();
})

webhookRouter.post('/test/follow', async (request: Request, response: Response) => {
  let { name } = request.body;
  name = name.toLocaleLowerCase();

  let userInfo: User
  try {
    userInfo = await Twitch.getUser(name)
  }
  catch (err) {
    log(LogLevel.Error, `webhooks: /test/follow - ${err}`)
  }

  emit(Events.OnFollow, new OnFollowEvent(userInfo))

  response.status(200).send();
})

webhookRouter.post('/test/sub', async (request: Request, response: Response) => {
  let { name } = request.body;
  name = name.toLocaleLowerCase();

  let userInfo: User
  try {
    userInfo = await Twitch.getUser(name)
  }
  catch (err) {
    log(LogLevel.Error, `webhooks: /test/sub - ${err}`)
  }

  emit(Events.OnSub, new OnSubEvent(userInfo, 'blah', null, null, 3, null));

  response.status(200).send();
})

webhookRouter.post('/test/cheer', async (request: Request, response: Response) => {
  let { name, bits } = request.body;
  name = name.toLocaleLowerCase();

  let userInfo: User
  try {
    userInfo = await Twitch.getUser(name)
  }
  catch (err) {
    log(LogLevel.Error, `webhooks: /test/cheer - ${err}`)
  }

  emit(Events.OnCheer, new OnCheerEvent(userInfo, 'blah', bits, null, null));

  response.status(200).send();
})

webhookRouter.post('/test/donation', async (request: Request, response: Response) => {
  let { name, amount } = request.body;
  name = name.toLocaleLowerCase();

  let userInfo: User
  try {
    userInfo = await Twitch.getUser(name)
  }
  catch (err) {
    log(LogLevel.Error, `webhooks: /test/donation - ${err}`)
  }

  emit(Events.OnDonation, new OnDonationEvent(userInfo, amount, 'blah'));

  response.status(200).send();
})

const emit = (event: Events, payload: any) => {
  EventBus.eventEmitter.emit(event, payload)
}
