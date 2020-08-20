export class ArchiveCallback {
  constructor(
    public id: string,
    public event: string,
    public duration: number,
    public name: string,
    public resolution: string,
    public sessionId: string,
    public url: string
  ) { }
}