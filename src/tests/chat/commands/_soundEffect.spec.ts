import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { _SoundEffect } from '../../../chat/commands/_soundEffect'
import { OnCommandEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags, moderatorFlags, broadcasterFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'words',
    '!words',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: _SoundEffect', () => {

  it('should not send message to chat', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    _SoundEffect(onCommandEvent)

    expect(spy.called).to.equal(false)
  })

  it('should send sound effect if command matches existing .mp3', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, spy)

    _SoundEffect(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send sound effect if command does not match existing .mp3', () => {
    onCommandEvent.command = 'no_such_file'
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, spy)

    _SoundEffect(onCommandEvent)

    expect(spy.called).to.equal(false)
  })

  it('should not send events if on cooldown', () => {
    const sfxSpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, sfxSpy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    _SoundEffect(onCommandEvent)

    expect(sfxSpy.called).to.equal(false)
  })

  it('should send events if on cooldown and user is moderator', () => {
    onCommandEvent.flags = moderatorFlags()
    const sfxSpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, sfxSpy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    _SoundEffect(onCommandEvent)

    expect(sfxSpy.called).to.equal(true)
  })

  it('should send events if on cooldown and user is broadcaster', () => {
    onCommandEvent.flags = broadcasterFlags()
    const sfxSpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, sfxSpy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    _SoundEffect(onCommandEvent)

    expect(sfxSpy.called).to.equal(true)
  })

  it('should not send events if on user cooldown', () => {
    const sfxSpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, sfxSpy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    _SoundEffect(onCommandEvent)

    expect(sfxSpy.called).to.equal(false)
  })
})