export class Action {
  constructor(
    public actionDate: string,
    public userId: string,
    public displayName: string,
    public avatarUrl: string,
    public eventType: string,
    public eventData: unknown,
    public _id?: string,
  ) { }
}