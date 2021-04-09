import { Attention } from "./commands/attention";
import { Azure } from './commands/azure';
import { Awesum } from "./commands/awesum";
import { Blog } from "./commands/blog";
import { Conduct } from "./commands/conduct";
import { Discord } from "./commands/discord";
import { Feedback } from './commands/feedback';
import { FFL } from "./commands/ffl";
import { Font } from "./commands/font";
import { GitHub } from "./commands/github";
import { Giving } from "./commands/giving";
import { Hardware } from "./commands/hardware";
import { Help } from "./commands/help";
import { Hype } from "./commands/hype";
import { Instagram } from "./commands/instagram";
import { Keyboard } from "./commands/keyboard";
import { LiveCoders } from "./commands/livecoders";
import { POBox } from "./commands/pobox";
import { So } from "./commands/so";
import { Stop } from "./commands/stop";
import { Store } from "./commands/store";
import { Theme } from "./commands/theme";
import { Twitter } from "./commands/twitter";
import { Youtube } from "./commands/youtube";
import { Vonage } from "./commands/vonage";
import { Command } from "./models/Command";

export abstract class CommandRegistry {
  private static commands: [Command?] = []

  public static init(): void {
    this.commands = []

    this.commands.push(new Command('azure', Azure))

    this.commands.push(new Command('attention', Attention))
    this.commands.push(new Command('awesum', Awesum))
    this.commands.push(new Command('blog', Blog))
    this.commands.push(new Command('conduct', Conduct))
    this.commands.push(new Command('discord', Discord))
    this.commands.push(new Command('feedback', Feedback))
    this.commands.push(new Command('ffl', FFL))
    this.commands.push(new Command('font', Font))
    this.commands.push(new Command('github', GitHub))
    this.commands.push(new Command('giving', Giving))
    this.commands.push(new Command('hardware', Hardware))
    this.commands.push(new Command('help', Help))
    this.commands.push(new Command('hype', Hype))
    this.commands.push(new Command('instagram', Instagram))
    this.commands.push(new Command('keyboard', Keyboard))
    this.commands.push(new Command('livecoders', LiveCoders))
    this.commands.push(new Command('pobox', POBox))
    this.commands.push(new Command('so', So))
    this.commands.push(new Command('stop', Stop))
    this.commands.push(new Command('store', Store))
    this.commands.push(new Command('theme', Theme))
    this.commands.push(new Command('twitter', Twitter))
    this.commands.push(new Command('vonage', Vonage))
    this.commands.push(new Command('youtube', Youtube))
  }

  public static getCommand(commandName: string): Command | undefined {
    return this.commands.find(f => f.commandName === commandName)
  }

  public static getCommands(): Command[] {
    return this.commands
  }
}