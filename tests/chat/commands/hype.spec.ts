import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Hype } from '../../../src/chat/commands/hype'
import { OnCommandEvent } from '../../../src/models'
import { EventBus, Events } from '../../../src/events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'hype',
    '!hype',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Hype', () => {

  it('should send message to chat', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    Hype(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

})