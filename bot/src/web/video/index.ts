import express from 'express'
// import proxy from 'express-http-proxy'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'

export const videoRouter: express.Router = express.Router()

if (process.env.NODE_ENV == 'development') {
  videoRouter.use(createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }))
}
else {
  // Serve up the basic HTML & compiled JS/SCSS
  videoRouter.use(express.static(path.join(__dirname, 'wwwroot')))
}
