import { Credit } from "./Credit";

export class OnCreditRollEvent {
  constructor(
    public credits: Credit[]
  ) { }
}