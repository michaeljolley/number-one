import { User } from "./User";
import { IUserEvent } from "./IUserEvent"

export class OnFollowEvent implements IUserEvent {
  constructor(
    public user: User
  ) { }
}