import { expect } from 'chai';
import { OnFollowEvent } from '../../models';
import { user } from '../test-objects';

describe('Model: OnFollowEvent', () => {
    it('should set values in constructor', () => {
        const usr = user();
        const model = new OnFollowEvent(usr);
        expect(model.user).to.not.be.empty;
        expect(model.user).to.be.equal(usr);
    })
})