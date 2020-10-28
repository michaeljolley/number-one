import { User } from "./User";
import { OnMessageExtra, OnMessageFlags } from "comfy.js";
import { IUserEvent } from "./IUserEvent"

export class OnPointRedemptionEvent implements IUserEvent {
  constructor(
    public user: User,
    public message: string,
    public flags: OnMessageFlags,
    public self: boolean,
    public extra: OnMessageExtra
  ) { }
}