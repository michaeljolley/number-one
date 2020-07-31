import { User } from "./User"

export class OnRaidEvent {
  constructor(
    public user: User,
    public viewers: number
  ) { }
}