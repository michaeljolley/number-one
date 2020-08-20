import express, { Request, Response } from 'express'
import { EventBus, Events } from '../events'
import { FaunaClient } from '../integrations/fauna/fauna'
import { AMAVideo, ArchiveCallback } from '../models'
import { OnArchiveCallbackEvent } from '../models/OnArchiveCallbackEvent'

export const webhookRouter: express.Router = express.Router()

webhookRouter.get('/streamEvent', (request: Request, response: Response) => {

})

webhookRouter.get('/follow', (request: Request, response: Response) => {

})

webhookRouter.post('/archive', async (request: Request, response: Response) => {

  const payload: ArchiveCallback = request.body

  if (payload && payload.sessionId) {

    const sessionId: string = ''

    // Get the AMAVideo from Fauna Db
    let video: AMAVideo = await FaunaClient.getAMAVideo(sessionId)

    if (video) {
      // Update its duration, resolution, and url
      video.duration = payload.duration
      video.resolution = payload.resolution
      video.url = payload.url

      // Save it back to fauna
      video = await FaunaClient.saveAMAVideo(video)

      // Emit an event that we received an AMA Video
      EventBus.eventEmitter.emit(Events.OnArchiveCallback, new OnArchiveCallbackEvent(video))
    }
  }
})