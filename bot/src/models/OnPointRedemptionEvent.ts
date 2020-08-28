import { User } from "./User";
import { UserFlags, Extra } from "comfy.js";
import { IUserEvent } from "./IUserEvent"

export class OnPointRedemptionEvent implements IUserEvent {
  constructor(
    public user: User,
    public message: string,
    public flags: UserFlags,
    public self: boolean,
    public extra: Extra
  ) { }
}