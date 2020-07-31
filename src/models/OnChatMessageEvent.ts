import { UserFlags, Extra } from "comfy.js"
import { User } from "./User"

export class OnChatMessageEvent {
  constructor(
    public user: User,
    public message: string,
    public flags: UserFlags,
    public self: boolean,
    public extra: Extra
  ) { }
}