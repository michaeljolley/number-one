import { User } from "./User";

export class OnJoinEvent {
  constructor(
    public user: User,
    public self: boolean
  ) { }
}