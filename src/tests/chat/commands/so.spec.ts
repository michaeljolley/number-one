import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { So } from '../../../chat/commands/so'
import { OnCommandEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, broadcasterFlags, moderatorFlags, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'so',
    'whitep4nth3r',
    moderatorFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Shoutout', () => {

  it('should not send message to chat for viewer', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.flags = viewerFlags()
    So(onCommandEvent)

    expect(spy.called).to.equal(false)
  })

  it('should send message to chat for moderator', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    So(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should send message to chat for broadcaster', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.flags = broadcasterFlags()
    So(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send events if on cooldown', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    So(onCommandEvent)

    expect(spy.called).to.equal(false)
  })

  it('should not send events if on user cooldown', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    So(onCommandEvent)

    expect(spy.called).to.equal(false)
  })
})
