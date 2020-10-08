import { EmoteSet } from "comfy.js";

export class Emotes {
  public emotes: [Emote];

  constructor(emoteSet: EmoteSet) {
    for (const [key, value] of Object.entries(emoteSet)) {
      const emote = new Emote(key);
      for (const pos of value) {
        const posXY = pos.split('-');
        emote.positions.push(new Position(parseInt(posXY[0]), parseInt(posXY[1])));
      }
      this.emotes.push(emote);
    }
  }
}

class Emote {
  public positions: [Position]

  constructor(public name: string) { }
}

class Position {
  constructor(
    public start: number,
    public end: number
  ) { }
}