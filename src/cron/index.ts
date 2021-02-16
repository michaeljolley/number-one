import { CronJob } from 'cron';
import { Twitch } from '../integrations';

export abstract class Cron {

  private static twitchWebhooksCronJob: CronJob;

  public static init(): void {
    this.registerTwitchWebhooks();
  }

  public static destroy(): void {
    if (this.twitchWebhooksCronJob) {
      this.twitchWebhooksCronJob.stop();
    }
  }

  private static registerTwitchWebhooks(): void {
    this.twitchWebhooksCronJob = new CronJob('0 1 * * *', async function () {
      await Twitch.registerWebhooks();
    }, null, true, 'America/Chicago');
    this.twitchWebhooksCronJob.start();
  }

}