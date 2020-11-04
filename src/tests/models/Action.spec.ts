import { expect } from 'chai';
import { Action } from '../../models/Action';

describe('Model: Action', () => {
    it('should set values in constructor', () => {
        const props = ["actionDate","userId","displayName","avatarUrl","eventType","eventData","_id"];
        const propVals = ["1","2","3","4","5","6","7"];
        const model = new Action(
            propVals[0],
            propVals[1],
            propVals[2],
            propVals[3],
            propVals[4],
            propVals[5],
            propVals[6]
        );

        const letModelAny = (model as any);
        for(const idx in props) {
            const prop = props[idx];
            expect(letModelAny[prop]).to.not.be.undefined;
            expect(letModelAny[prop]).to.be.equal(propVals[idx]);
        }
    })
})