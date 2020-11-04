import { expect } from 'chai';
import { Events, Listener } from '../../events';

describe('Model: Listener', () => {
    it('should set values in constructor', () => {
        const listener = new Listener(Events.OnSay, () => {});

        expect((listener as any).type).to.equal(Events.OnSay);
        expect(typeof (listener as any).listener).to.equal("function");
    })
})