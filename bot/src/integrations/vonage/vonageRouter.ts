import express, { Request, Response } from 'express'
const OpenTok = require('opentok')

const openTok = new OpenTok(process.env.VIDEO_API_KEY, process.env.VIDEO_API_SECRET)

export const vonageRouter: express.Router = express.Router()

vonageRouter.get('/join/:sessionId?', (request: Request, response: Response) => {
  let sessionId = request.params.sessionId

  if (!sessionId) {
    openTok.createSession({ mediaMode: "routed", archiveMode: 'always' }, (err, session) => {
      if (err) {
        response.status(500).send(err)
      }
      getToken(response, session.sessionId)
    })
  }
  else {
    getToken(response, sessionId)
  }
})

function getToken(response: Response, sessionId: string) {
  const token = openTok.generateToken(sessionId, {
    role: 'publisher',
    expireTime: (new Date().getTime() / 1000) + (30 * 60)
  })

  response.status(200).json({
    apiKey: process.env.VIDEO_API_KEY,
    sessionId,
    token
  })
}