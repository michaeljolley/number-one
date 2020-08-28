import express, { Request, Response } from 'express'
import path from 'path'

export const overlayRouter: express.Router = express.Router()

// Serve up the basic HTML & compiled JS/SCSS
overlayRouter.use(express.static(path.join(__dirname, 'wwwroot')))


overlayRouter.get('/chat', (request: Request, response: Response) => {
  response.status(200).json({ status: 'good' })
})
