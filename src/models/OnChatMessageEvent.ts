import { UserFlags, Extra } from "comfy.js"
import { User } from "./User"
import { IUserEvent } from "./IUserEvent"

export class OnChatMessageEvent implements IUserEvent {
  constructor(
    public user: User,
    public message: string,
    public sanitizedMessage: string,
    public flags: UserFlags,
    public self: boolean,
    public extra: Extra,
    public id: string,
    public emotes?: string[],
  ) { }
}