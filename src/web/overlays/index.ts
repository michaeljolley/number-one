import express from 'express'
import path from 'path'

export const overlayRouter: express.Router = express.Router()

// Serve up the basic HTML & compiled JS/SCSS
overlayRouter.use(express.static(path.join(__dirname, 'wwwroot')))
