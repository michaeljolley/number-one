export class TwitchTokenResponse {
  constructor(
    public access_token: string,
    public expires_in: number,
    public token_type: string) { }
}