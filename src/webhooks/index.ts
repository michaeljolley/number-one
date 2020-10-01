import express, { Request, Response } from 'express'

export const webhookRouter: express.Router = express.Router()

webhookRouter.get('/streamEvent', (request: Request, response: Response) => {

})

webhookRouter.get('/follow', (request: Request, response: Response) => {

})
