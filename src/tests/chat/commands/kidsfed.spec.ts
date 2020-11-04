import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { KidsFed } from '../../../chat/commands/kidsfed'
import { OnCommandEvent, OnPocketChangeEvent, OnSayEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'
import { State } from '../../../state'

let onCommandEvent: OnCommandEvent
const sandbox: sinon.SinonSandbox = sinon.createSandbox()
sandbox.stub(State, "getAmountGiven").resolves(4);

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'kidsfed',
    '!kidsfed',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})
after(() => {
    sandbox.restore();
})
describe('Commands: KidsFed', () => {
    it('should send message to chat', async () => {
      const spy = sinon.spy();
      const emitter = EventBus.eventEmitter
      emitter.on(Events.OnSay, spy)
      await KidsFed(onCommandEvent)
      expect(spy.called).to.be.true;
      expect((spy.getCall(0).args[0] as OnSayEvent).message).contains("We've fed");
    })
    it('should send message to chat about plural kids', async () => {
      sandbox.restore();
      const spy = sinon.spy();
      sandbox.stub(State, "getAmountGiven").resolves(8);
      const emitter = EventBus.eventEmitter
      emitter.on(Events.OnSay, spy)
      await KidsFed(onCommandEvent)
      expect(spy.called).to.be.true;
      expect((spy.getCall(0).args[0] as OnSayEvent).message).contains("We've fed 2 kids");
    })
    it('should initiate overlay update', async () => {
      const spy = sinon.spy();
      const emitter = EventBus.eventEmitter
      emitter.on(Events.RequestGivingUpdate, spy)
      await KidsFed(onCommandEvent)
      expect(spy.called).to.be.true;
    })

  it('should not send events if on cooldown', () => {
    const spy = sandbox.spy()
    const reqSpy = sandbox.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)
    emitter.on(Events.RequestGivingUpdate, reqSpy);
    
    onCommandEvent.extra.sinceLastCommand.any = 10

    KidsFed(onCommandEvent)

    expect(spy.called).to.be.false;
    expect(reqSpy.called).to.be.false;
  })

  it('should not send events if on user cooldown', () => {
    const spy = sandbox.spy()
    const reqSpy = sandbox.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)
    emitter.on(Events.RequestGivingUpdate, reqSpy);
    onCommandEvent.extra.sinceLastCommand.user = 10

    KidsFed(onCommandEvent)

    expect(spy.called).to.be.false;
    expect(reqSpy.called).to.be.false;
  })
})