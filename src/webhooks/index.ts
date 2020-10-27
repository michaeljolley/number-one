import express, { Request, Response } from 'express'
import { log, LogLevel } from '../common'
import { EventBus, Events } from '../events'
import { Twitch } from '../integrations'
import { IUserEvent, OnCheerEvent, OnDonationEvent, OnFollowEvent, OnRaidEvent, OnStreamEndEvent, OnSubEvent, Stream, User } from '../models'
import { OnStreamChangeEvent } from '../models/OnStreamChangeEvent'
import { State } from '../state'

export const webhookRouter: express.Router = express.Router()


webhookRouter.get('/stream', (request: Request, response: Response) => {
  response.contentType('text/plain');
  response.status(200).send(request.query['hub.challenge']);
})

webhookRouter.post('/stream', Twitch.validateWebhook, async (request: Request, response: Response) => {
  const payload = request.body;

  if (payload && payload.data) {

    try {
      if (payload.data.length > 0) {
        const streamInfo = payload.data[0];
        const stream = new Stream(
          streamInfo.id,
          streamInfo.started_at,
          streamInfo.started_at,
          streamInfo.title
        );
        emit(Events.OnStreamChange, new OnStreamChangeEvent(stream));

      } else {
        const stream = await State.getStream()

        if (stream) {
          emit(Events.OnStreamEnd, new OnStreamEndEvent(stream));
        }
      }
    }
    catch (err) {
      log(LogLevel.Error, `webhooks: /stream - ${err}`)
    }
  }

  response.contentType('text/plain');
  response.status(200).send(request.query['hub.challenge']);
})

webhookRouter.get('/follow', (request: Request, response: Response) => {
  response.contentType('text/plain');
  response.status(200).send(request.query['hub.challenge']);
})

webhookRouter.post('/follow', Twitch.validateWebhook, async (request: Request, response: Response) => {
  const payload = request.body;

  if (payload && payload.data && payload.data.length > 0) {
    const name = payload.data[0].from_name.toLocaleLowerCase();

    let userInfo: User
    try {
      userInfo = await Twitch.getUser(name)
    }
    catch (err) {
      log(LogLevel.Error, `webhooks: /follow - ${err}`)
    }

    emit(Events.OnFollow, new OnFollowEvent(userInfo));
  }

  response.contentType('text/plain');
  response.status(200).send(request.query['hub.challenge']);
})

webhookRouter.post('/test/raid', async (request: Request, response: Response) => {
  const { name, viewers } = request.body;
  
  let userInfo: User
  try {
    userInfo = await Twitch.getUser(name.toLocaleLowerCase())
  }
  catch (err) {
    log(LogLevel.Error, `webhooks: /test/raid - ${err}`)
  }

  emit(Events.OnRaid, new OnRaidEvent(userInfo, viewers))

  response.status(200).send();
})

webhookRouter.get('/test/credits', async (request: Request, response: Response) => {
  emit(Events.RequestCreditRoll, null)
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
  const { name, bits } = request.body;

  let userInfo: User
  try {
    userInfo = await Twitch.getUser(name.toLocaleLowerCase())
  }
  catch (err) {
    log(LogLevel.Error, `webhooks: /test/cheer - ${err}`)
  }

  emit(Events.OnCheer, new OnCheerEvent(userInfo, 'blah', bits, null, null));

  response.status(200).send();
})

webhookRouter.post('/test/donation', async (request: Request, response: Response) => {
  const { name, amount, message } = request.body;

  emit(Events.OnDonation, new OnDonationEvent(name, amount, message));

  response.status(200).send();
})

const emit = (event: Events, payload: IUserEvent | OnDonationEvent | OnStreamChangeEvent) => {
  EventBus.eventEmitter.emit(event, payload)
}
