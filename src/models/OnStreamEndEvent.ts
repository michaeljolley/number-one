import { Stream } from "./Stream";

export class OnStreamEndEvent {
  constructor(
    public stream: Stream
  ) { }
}