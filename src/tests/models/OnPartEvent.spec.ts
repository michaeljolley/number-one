import { expect } from 'chai';
import { OnPartEvent } from '../../models';
import { user } from '../test-objects';

describe('Model: OnPartEvent', () => {
    it('should set values in constructor', () => {
        const usr = user();
        const model = new OnPartEvent(usr, false);
        expect(model.user).to.not.be.empty;
        expect(model.user).to.be.equal(usr);
        expect(model.self).to.be.false;
    })
})