export class VonageEvent {
  constructor(
    public id: string,
    public type: string,
    public from: string,
    public to: string,
    public body: object,
    public state: string,
    public timestamp: Date
  ) { }
}