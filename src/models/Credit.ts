export class Credit {
  constructor(
    public displayName: string,
    public avatarUrl: string,

    public onCheer?: boolean,
    public onSub?: boolean,
    public onDonation?: boolean,
    public onSponsor?: boolean,
  ) { }
}