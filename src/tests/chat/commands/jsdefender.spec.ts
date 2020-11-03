import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { JSDefender } from '../../../chat/commands/jsdefender'
import { OnCommandEvent, OnSayEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'jsdefender',
    '!jsdefender',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: JSDefender', () => {

  it('should send message to chat', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    JSDefender(onCommandEvent)

    expect(spy.called).to.equal(true)
    expect(spy.calledWithMatch((arg: OnSayEvent) => {
        return arg.message.indexOf("https://bbb.dev/") > -1 && arg.message.indexOf("JSDefender") > -1;
    })).to.be.true;
  })

  it('should not send events if on cooldown', () => {
    const saySpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, saySpy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    JSDefender(onCommandEvent)

    expect(saySpy.called).to.equal(false)
  })

  it('should not send events if on user cooldown', () => {
    const saySpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, saySpy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    JSDefender(onCommandEvent)

    expect(saySpy.called).to.equal(false)
  })
})