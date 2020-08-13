import { User } from "./User";
import { IUserEvent } from "./IUserEvent"

export class OnDonationEvent implements IUserEvent {
  constructor(
    public user: User,
    public amount: number,
    public message: string
  ) { }
}