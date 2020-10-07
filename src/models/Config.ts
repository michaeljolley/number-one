export class Config {
  constructor(
    public twitchClientId: string,
    public twitchChannelName: string,
    public twitchChannelAuthToken: string,
    public twitchBotUsername: string,
    public twitchBotAuthToken: string,
    public twitchChannelId?: string,
    public streamElementsJWT?: string) { }
}