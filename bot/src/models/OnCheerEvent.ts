import { UserFlags, Extra } from "comfy.js"
import { User } from "./User"
import { IUserEvent } from "./IUserEvent"

export class OnCheerEvent implements IUserEvent {
  constructor(
    public user: User,
    public message: string,
    public bits: number,
    public flags: UserFlags,
    public extra: Extra
  ) { }
}