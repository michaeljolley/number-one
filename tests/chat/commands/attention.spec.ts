import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Attention } from '../../../src/chat/commands/attention'
import { OnCommandEvent } from '../../../src/models'
import { EventBus, Events } from '../../../src/events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user,
    'attention',
    '!attention',
    viewerFlags,
    onCommandExtra,
    activeStream)
})

describe('Commands: Attention', () => {

  it('should send message to chat', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    Attention(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should send sound effect', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, spy)

    Attention(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send events if on cooldown', () => {
    var saySpy = sinon.spy()
    var sfxSpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, sfxSpy)
    emitter.on(Events.OnSay, saySpy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    Attention(onCommandEvent)

    expect(saySpy.called).to.equal(false)
    expect(sfxSpy.called).to.equal(false)
  })

  it('should not send events if on user cooldown', () => {
    var saySpy = sinon.spy()
    var sfxSpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, sfxSpy)
    emitter.on(Events.OnSay, saySpy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    Attention(onCommandEvent)

    expect(saySpy.called).to.equal(false)
    expect(sfxSpy.called).to.equal(false)
  })
})