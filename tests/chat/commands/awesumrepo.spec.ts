import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { AwesumRepo } from '../../../src/chat/commands/awesumrepo'
import { OnCommandEvent } from '../../../src/models'
import { EventBus, Events } from '../../../src/events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'awesumrepo',
    '!awesumrepo',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: AwesumRepo', () => {

  it('should send message to chat', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    AwesumRepo(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send events if on cooldown', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    AwesumRepo(onCommandEvent)

    expect(spy.called).to.equal(false)
  })

  it('should not send events if on user cooldown', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    AwesumRepo(onCommandEvent)

    expect(spy.called).to.equal(false)
  })
})