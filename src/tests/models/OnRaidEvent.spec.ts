import { expect } from 'chai';
import { OnRaidEvent } from '../../models';
import { User } from '../../models/User';
import { user } from '../test-objects/Users';

describe('Model: OnRaidEvent', () => {
    it('should set values in constructor', () => {
        const props = ["user","viewers"];
        const propVals = [user(),32];
        const model = new OnRaidEvent(
            propVals[0] as User,
            propVals[1] as number
        );

        const letModelAny = (model as any);
        for(const idx in props) {
            const prop = props[idx];
            expect(letModelAny[prop]).to.not.be.undefined;
            expect(letModelAny[prop]).to.be.equal(propVals[idx]);
        }
    })
})