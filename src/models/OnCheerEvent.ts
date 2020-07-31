import { UserFlags, Extra } from "comfy.js"
import { User } from "./User"

export class OnCheerEvent {
  constructor(
    public user: User,
    public message: string,
    public bits: number,
    public flags: UserFlags,
    public extra: Extra
  ) { }
}