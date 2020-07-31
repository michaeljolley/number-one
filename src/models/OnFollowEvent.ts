import { User } from "./User";

export class OnFollowEvent {
  constructor(
    public user: User
  ) { }
}