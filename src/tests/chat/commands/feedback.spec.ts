import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Feedback } from '../../../chat/commands/feedback'
import { OnCommandEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'feedback',
    '!feedback',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Feedback', () => {

  it('should send message to chat', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    Feedback(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send events if on cooldown', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    Feedback(onCommandEvent)

    expect(spy.called).to.equal(false)
  })

  it('should not send events if on user cooldown', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    Feedback(onCommandEvent)

    expect(spy.called).to.equal(false)
  })
})