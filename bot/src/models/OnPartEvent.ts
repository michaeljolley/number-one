import { User } from "./User";
import { IUserEvent } from "./IUserEvent"

export class OnPartEvent implements IUserEvent {
  constructor(
    public user: User,
    public self: boolean
  ) { }
}