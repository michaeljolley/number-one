import { User } from "./User";

export class AMAVideo {
  constructor(
    public sessionId: string,
    public user: User,
    public isApproved: boolean,
    public hasAired: boolean,
    public resolution?: string,
    public duration?: number,
    public url?: string,
    public _id?: string
  ) { }
}