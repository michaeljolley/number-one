import { expect } from 'chai';
import { Sponsor } from '../../models/Sponsor';

describe('Model: Sponsor', () => {
    it('should set values in constructor', () => {
        const props = ["displayName","tier"];
        const propVals = ["1",2];
        const model = new Sponsor(
            propVals[0] as string,
            propVals[1] as number
        );

        const letModelAny = (model as any);
        for(var idx in props) {
            let prop = props[idx];
            expect(letModelAny[prop]).to.not.be.undefined;
            expect(letModelAny[prop]).to.be.equal(propVals[idx]);
        }
    })
})