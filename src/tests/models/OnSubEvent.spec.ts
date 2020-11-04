import { expect } from 'chai';
import { OnSubExtra, SubMethods } from 'comfy.js';
import { OnSubEvent } from '../../models';
import { User } from '../../models/User';
import { user, onSubExtra, cheerSubFlags } from '../test-objects';

describe('Model: OnSubEvent', () => {
    it('should set values in constructor', () => {
        
        const props = ["user","message","subTierInfo","extra","cumulativeMonths","subGifter"];
        const propVals = [user(),"2",3,cheerSubFlags(),onSubExtra(), user()];
        const model = new OnSubEvent(
            propVals[0] as User,
            propVals[1] as string,
            propVals[2] as SubMethods,
            propVals[3] as OnSubExtra,
            propVals[4] as number,
            propVals[5] as User
        );

        const letModelAny = (model as any);
        for(var idx in props) {
            let prop = props[idx];
            expect(letModelAny[prop]).to.not.be.undefined;
            expect(letModelAny[prop]).to.be.equal(propVals[idx]);
        }
    })
})