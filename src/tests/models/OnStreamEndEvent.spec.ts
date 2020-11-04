import { expect } from 'chai';
import { OnStreamEndEvent } from '../../models';
import { activeStream } from '../test-objects';

describe('Model: OnStreamEndEvent', () => {
    it('should set values in constructor', () => {
        const str = activeStream()
        const model = new OnStreamEndEvent(str);
        expect(model.stream).to.not.be.undefined;
        expect(model.stream).to.be.equal(str);
    })
})