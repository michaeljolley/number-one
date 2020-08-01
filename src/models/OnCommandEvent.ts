import { User } from "./User";
import { UserFlags, Extra } from "comfy.js";
import { Stream } from "./Stream";

export class OnCommandEvent {
  constructor(
    public user: User,
    public command: string,
    public message: string,
    public flags: UserFlags,
    public extra: Extra,
    public stream: Stream
  ) { }
}