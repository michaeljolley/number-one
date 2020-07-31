import { User } from "./User";

export class OnPartEvent {
  constructor(
    public user: User,
    public self: boolean
  ) { }
}