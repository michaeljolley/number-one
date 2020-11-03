import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { KidsFed } from '../../../chat/commands/kidsfed'
import { OnCommandEvent, OnPocketChangeEvent, OnSayEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'
import { State } from '../../../state'

let onCommandEvent: OnCommandEvent
let sandbox: sinon.SinonSandbox = sinon.createSandbox()
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
  it('should send message to chat', () => {
    const spy = sinon.spy()
    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    KidsFed(onCommandEvent)
    expect(spy.called).to.be.true;
    expect(spy.calledWith((args:OnSayEvent) => {
        console.log(args.message);
        return args.message.indexOf("We've fed") > -1
    }))
    
  })
  it('should initiate overlay update', () => {
    const spy = { fn: () => {}}
    const mock = sandbox.mock(spy);
    mock.expects("fn").called;
    const emitter = EventBus.eventEmitter
    emitter.on(Events.RequestGivingUpdate, spy.fn)
    KidsFed(onCommandEvent)
    mock.verify();
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