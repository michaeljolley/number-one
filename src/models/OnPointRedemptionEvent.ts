import { User } from "./User";
import { UserFlags, Extra } from "comfy.js";

export class OnPointRedemptionEvent {
  constructor(
    public user: User,
    public message: string,
    public flags: UserFlags,
    public self: boolean,
    public extra: Extra
  ) { }
}