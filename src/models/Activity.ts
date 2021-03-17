export class Activity {
  constructor(
    public title: string,
    public description: string,
    public activity_type: string,
    public key: string,
    public occurred_at: string,
    public weight?: string,
  ) { }
}