import { expect } from 'chai';
import { OnDonationEvent } from '../../models/OnDonationEvent';
import { User } from '../../models/User';
import { user } from '../test-objects';

describe('Model: OnDonationEvent', () => {
    it('should set values in constructor', () => {
        const props = ["user","amount","message","twitchUser"];
        const propVals = ["1",2,"3",user()];
        const model = new OnDonationEvent(
            propVals[0] as string,
            propVals[1] as number,
            propVals[2] as string,
            propVals[3] as User
        );

        const letModelAny = (model as any);
        for(const idx in props) {
            const prop = props[idx];
            expect(letModelAny[prop]).to.not.be.undefined;
            expect(letModelAny[prop]).to.be.equal(propVals[idx]);
        }
    })
})