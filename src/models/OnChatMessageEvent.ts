import { OnMessageExtra, OnMessageFlags } from "comfy.js"
import { User } from "./User"
import { IUserEvent } from "./IUserEvent"

export class OnChatMessageEvent implements IUserEvent {
  constructor(
    public user: User,
    public message: string,
    public sanitizedMessage: string,
    public flags: OnMessageFlags,
    public self: boolean,
    public extra: OnMessageExtra,
    public id: string,
    public emotes?: string[],
  ) { }
}