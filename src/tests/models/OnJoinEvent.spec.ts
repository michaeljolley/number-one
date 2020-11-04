import { expect } from 'chai';
import { OnJoinEvent } from '../../models';
import { user } from '../test-objects';

describe('Model: OnJoinEvent', () => {
    it('should set values in constructor', () => {
        const usr = user();
        const model = new OnJoinEvent(usr, false);
        expect(model.user).to.not.be.empty;
        expect(model.user).to.be.equal(usr);
        expect(model.self).to.be.false;
    })
})