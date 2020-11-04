import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Hardware } from '../../../chat/commands/hardware'
import { OnCommandEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'hardware',
    '!hardware',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Hardware', () => {

  it('should send message to chat', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    Hardware(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send events if on cooldown', () => {
    const saySpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, saySpy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    Hardware(onCommandEvent)

    expect(saySpy.called).to.equal(false)
  })

  it('should not send events if on user cooldown', () => {
    const saySpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, saySpy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    Hardware(onCommandEvent)

    expect(saySpy.called).to.equal(false)
  })
})