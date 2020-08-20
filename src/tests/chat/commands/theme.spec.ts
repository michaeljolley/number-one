import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Theme } from '../../../chat/commands/theme'
import { OnCommandEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'theme',
    '!theme lasers',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Theme', () => {

  it('should send message to chat', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    Theme(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send events if theme is okay', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    onCommandEvent = new OnCommandEvent(
      user(),
      'theme',
      '!theme dracula',
      viewerFlags(),
      onCommandExtra(),
      activeStream())

    Theme(onCommandEvent)

    expect(spy.called).to.equal(false)
  })


  it('should not send events if user is dot_commie and theme is lasers', () => {
    var spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    let callingUser = user()
    callingUser.login = 'dot_commie'

    onCommandEvent = new OnCommandEvent(
      callingUser,
      'theme',
      '!theme lasers',
      viewerFlags(),
      onCommandExtra(),
      activeStream())

    Theme(onCommandEvent)

    expect(spy.called).to.equal(false)
  })
})