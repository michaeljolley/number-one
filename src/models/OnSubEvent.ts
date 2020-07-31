import { Extra } from 'comfy.js'
import { SubMethods } from 'tmi.js'

import { User } from "./User"

export class OnSubEvent {
  constructor(
    public user: User,
    public message: string,
    public subTierInfo: SubMethods,
    public extra: Extra,
    public cumulativeMonths?: number,
    public subGifter?: User
  ) { }
}