import { User } from "./User";

export class OnDonationEvent {
  constructor(
    public user: User,
    public amount: number,
    public message: string
  ) { }
}