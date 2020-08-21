import express from 'express'
import path from 'path'

export const videoRouter: express.Router = express.Router()

// Serve up the basic HTML & compiled JS/SCSS
videoRouter.use(express.static(path.join(__dirname, 'wwwroot')))
