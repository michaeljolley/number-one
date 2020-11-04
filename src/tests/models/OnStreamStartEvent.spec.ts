import { expect } from 'chai';
import { OnStreamStartEvent } from '../../models';
import { activeStream } from '../test-objects';

describe('Model: OnStreamStartEvent', () => {
    it('should set values in constructor', () => {
        const str = activeStream()
        const model = new OnStreamStartEvent(str);
        expect(model.stream).to.not.be.undefined;
        expect(model.stream).to.be.equal(str);
    })
})