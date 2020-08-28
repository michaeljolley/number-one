import { User } from "./User";
import { IUserEvent } from "./IUserEvent"

export class OnJoinEvent implements IUserEvent {
  constructor(
    public user: User,
    public self: boolean
  ) { }
}