import { log, LogLevel } from '../common'
import * as Crypto from 'crypto'

export abstract class TwitchWebhookValidator {

    public static validate(request, response, next) {

        const givenSignature = request.headers['x-hub-signature'];
      
        if (!givenSignature) {
            log(LogLevel.Error, `webhooks: validator - missing signature`)
            return response.status(409).json({
                error: 'Missing signature'
            });
        }

        let digest = Crypto.createHmac('sha256',process.env.TWITCH_CLIENT_SECRET)
            .update(JSON.stringify(request.body))
            .digest('hex');
      
        if (givenSignature === `sha256=${digest}`) {
            return next();
        } else {
            log(LogLevel.Error, `webhooks: validator - invalid signature`)
            return response.status(409).json({
                error: 'Invalid signature'
            });
        }
    }
}