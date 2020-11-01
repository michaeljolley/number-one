import { expect } from 'chai';
import { Stream } from 'stream';
import { Cache } from '../../cache/cache'
import { CacheType } from '../../cache/cacheType'
import { User } from '../../models';

describe('Cache', () => {
    describe('get (unset)', () => {
        it('should return undefined user array when uninitialized', () => {
            const usRet = Cache.get(CacheType.User, "test");
            expect((Cache as any).users.length).to.equal(0); //eslint-disable-line
            expect(usRet).to.be.undefined; //expect undefined because find returns undefined if not found
        })
        it('should return undefined stream array when uninitialized', () => {
            const stRet = Cache.get(CacheType.Stream, "test");
            expect((Cache as any).streams.length).to.equal(0); //eslint-disable-line
            expect(stRet).to.be.undefined; //expect undefined because find returns undefined if not found
        })
    })
    describe('set', () => {
        it('should add the user provided to the array', () => {
            const user = new User(
                "fakeLogin", 
                "fakeAvatarUrl",
                "fakeId",
                "fakeDisplayname", 
                new Date(), 
                "fakeDbId");
            Cache.set(CacheType.User, user);
            expect((Cache as any).users.length).to.be.equal(1); //eslint-disable-line
        })
        it('should add the stream provided to the array', () => {
            const str = new Stream();
            (str as any).streamDate = "2020-10-29"; //eslint-disable-line
            Cache.set(CacheType.Stream, str);
            expect((Cache as any).streams.length).to.be.equal(1); //eslint-disable-line
        })
    })
    describe('get (set)', () => {
        it('should return the cached user', () => {
            const usRet = Cache.get(CacheType.User, "fakeLogin");
            expect((Cache as any).users.length).to.equal(1); //eslint-disable-line
            expect(usRet).to.not.be.undefined; 
            expect((usRet as User).login).to.be.equal("fakeLogin");
        })
        it('should return the cached stream', () => {
            const stRet = Cache.get(CacheType.Stream, "2020-10-29");
            expect((Cache as any).streams.length).to.equal(1); //eslint-disable-line
            expect(stRet).to.not.be.undefined; 
            expect((stRet as any).streamDate).to.be.equal("2020-10-29"); //eslint-disable-line
        })
    })

})