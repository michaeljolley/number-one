import express from 'express'
import path from 'path'
import sass from 'node-sass-middleware'

export const adminRouter: express.Router = express.Router()

// Serve up the basic HTML & compiled JS/SCSS
adminRouter.use(
  express.static(path.join(__dirname, 'wwwroot'))
)

if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
  adminRouter.use(
    // Used to convert our scss to css on the fly
    sass({
      src: __dirname,
      response: true,
      debug: true
    })
  )
}
