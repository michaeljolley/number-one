import { Stream } from "./Stream";

export class OnStreamStartEvent {
  constructor(
    public stream: Stream
  ) { }
}