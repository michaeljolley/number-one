import express, { Request, Response } from 'express'
import { Twitch } from '../integrations'

export const userRouter: express.Router = express.Router()

userRouter.get('/:userLogin', async (request: Request, response: Response) => {
  let userLogin = request.params.userLogin

  const user = await Twitch.getUser(userLogin)

  if (user) {
    response.status(200).json(user)
  } else {
    response.status(404).send()
  }
})
