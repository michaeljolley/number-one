export class OnPocketChangeEvent {
  constructor(
    public amount: number
  ) {
    this.kidsFed = Math.floor(amount / 4);
  }
  
  public kidsFed: number
}