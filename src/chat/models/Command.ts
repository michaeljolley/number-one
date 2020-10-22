import { OnCommandEvent } from "../../models";


export class Command {
  constructor(
    public commandName: string,
    public command: (onCommandEvent: OnCommandEvent) => void
  ) { }
}