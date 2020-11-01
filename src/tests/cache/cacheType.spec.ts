import { expect } from 'chai';
import { CacheType } from '../../cache/cacheType';

describe('CacheType', () => {

    it('should contain User', () => {
        expect(CacheType.User).to.not.be.undefined;
    })
    it('should contain Stream', () => {
        expect(CacheType.Stream).to.not.be.undefined;
    })

})