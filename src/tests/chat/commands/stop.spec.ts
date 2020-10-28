import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Stop } from '../../../chat/commands/stop'
import { OnCommandEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'stop',
    '!stop',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Stop', () => {

  it('should emit stop command for broadcaster', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnStop, spy)

    onCommandEvent.flags.broadcaster = true

    Stop(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should emit stop command for mods', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnStop, spy)

    onCommandEvent.flags.mod = true

    Stop(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not emit for non mods/broadcaster', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnStop, spy)

    Stop(onCommandEvent)

    expect(spy.called).to.equal(false)
  })
})