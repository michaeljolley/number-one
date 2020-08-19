import { EventBus, Events } from "../events";
import { OnCommandEvent } from "../models";
import { CommandRegistry } from "./commandRegistry";
import { Command } from "./models/Command";

export class CommandMonitor {
  constructor() {
    CommandRegistry.init()

    EventBus.eventEmitter.addListener(Events.OnCommand,
      (onCommandEvent: OnCommandEvent) => this.handleCommand(onCommandEvent))
  }

  private handleCommand(onCommandEvent: OnCommandEvent) {
    const command: Command | undefined = CommandRegistry.getCommand(onCommandEvent.command)
    if (command) {
      command.command(onCommandEvent)
    }
  }
}
