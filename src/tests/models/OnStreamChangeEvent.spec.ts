import { expect } from 'chai';
import { OnStreamChangeEvent } from '../../models';
import { activeStream } from '../test-objects';

describe('Model: OnStreamChangeEvent', () => {
    it('should set values in constructor', () => {
        var str = activeStream()
        const model = new OnStreamChangeEvent(str);
        expect(model.stream).to.not.be.undefined;
        expect(model.stream).to.be.equal(str);
    })
})