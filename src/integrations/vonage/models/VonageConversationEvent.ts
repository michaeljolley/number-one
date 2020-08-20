import { IUserEvent } from "../../../models";

export class VonageConversationEvent {
  constructor(
    public id: string,
    public type: string,
    public from: string,
    public to: string,
    public body: IUserEvent,
    public state: string,
    public timestamp: string
  ) { }
}