import { VonageMember } from "./VonageMember";

export class VonageConversation {
  constructor(
    public uuid: string,
    public name: string,
    public numbers: object,
    public properties: object,
    public display_name: string,
    public members: [VonageMember?],
  ) { }
}