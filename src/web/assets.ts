// This route is for debug purposes only. Once built, the assets folder will be available
// directly to the express server.
import express from 'express';
import path from 'path'

export const assetsRouter: express.Router = express.Router()
const p = path.join(__dirname,'../../', 'assets')
assetsRouter.use(
  express.static(p)
)