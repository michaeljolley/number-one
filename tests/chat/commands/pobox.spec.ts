import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { POBox } from '../../../src/chat/commands/pobox'
import { OnCommandEvent } from '../../../src/models'
import { EventBus, Events } from '../../../src/events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'pobox',
    '!pobox',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: POBox', () => {

  it('should send message to chat', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    POBox(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send events if on cooldown', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    POBox(onCommandEvent)

    expect(spy.called).to.equal(false)
  })

  it('should not send events if on user cooldown', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    POBox(onCommandEvent)

    expect(spy.called).to.equal(false)
  })
})