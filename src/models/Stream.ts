export class Stream {
  constructor(
    public id: string,
    public started_at: string,
    public streamDate: string,
    public title: string,
    public ended_at?: string,
    public _id?: string
  ) { }
}