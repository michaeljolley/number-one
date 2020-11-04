import { expect } from 'chai';
import { Credit } from '../../models/Credit';

describe('Model: Credit', () => {
    it('should set values in constructor', () => {
        const props = ["displayName","avatarUrl","onCheer","onSub","onDonation","onSponsor","onRaid","tier",];
        const propVals = ["1","2",true,false,false,false,false,8];
        const model = new Credit(
            propVals[0] as string,
            propVals[1] as string,
            propVals[2] as boolean,
            propVals[3] as boolean,
            propVals[4] as boolean,
            propVals[5] as boolean,
            propVals[6] as boolean,
            propVals[7] as number
        );

        const letModelAny = (model as any);
        for(const idx in props) {
            const prop = props[idx];
            expect(letModelAny[prop]).to.not.be.undefined;
            expect(letModelAny[prop]).to.be.equal(propVals[idx]);
        }
    })
})