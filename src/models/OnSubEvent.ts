import { Extra } from 'comfy.js'
import { SubMethods } from 'tmi.js'

import { User } from "./User"
import { IUserEvent } from "./IUserEvent"

export class OnSubEvent implements IUserEvent {
  constructor(
    public user: User,
    public message: string,
    public subTierInfo: SubMethods,
    public extra: Extra,
    public cumulativeMonths?: number,
    public subGifter?: User
  ) {
  }
}