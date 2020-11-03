import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Attention } from '../../../chat/commands/attention'
import { OnCommandEvent, OnSayEvent } from '../../../models'
import { EventBus, Events } from '../../../events'

import { activeStream, onCommandExtra, user, viewerFlags } from '../../test-objects'

let onCommandEvent: OnCommandEvent

beforeEach(() => {
  onCommandEvent = new OnCommandEvent(
    user(),
    'attention',
    '!attention',
    viewerFlags(),
    onCommandExtra(),
    activeStream())
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Attention', () => {
  describe('Sends Message To Chat', () => {
    let stubbedFnCalled = false;
    let stubbedCalledWith = "";
    const stubbedFn = (onSayEvent: OnSayEvent): void => {
      stubbedFnCalled = true;
      stubbedCalledWith = onSayEvent.message;
    }
    afterEach(() => {
      stubbedFnCalled = false;
      stubbedCalledWith = "";
    })
    it('should send message to chat with users display_name', () => {
      const emitter = EventBus.eventEmitter
      emitter.on(Events.OnSay, stubbedFn)
      const stubbedUser = user();
      stubbedUser.display_name = "displayName";
      stubbedUser.login = "loginUserName";
      const newCmd = onCommandEvent = new OnCommandEvent(
        stubbedUser,
        'attention',
        '!attention',
        viewerFlags(),
        onCommandExtra(),
        activeStream())

      Attention(newCmd)
      expect(stubbedFnCalled).to.equal(true)
      expect(stubbedCalledWith).to.not.be.undefined;
      expect(stubbedCalledWith).to.not.be.empty;
      expect(stubbedCalledWith.indexOf(stubbedUser.display_name)).to.be.greaterThan(-1);

    })
    it('should send message to chat with users login', () => {
      const stubbedUser = user();
      delete stubbedUser.display_name;
      stubbedUser.login = "loginUserName";
      const emitter = EventBus.eventEmitter
      emitter.on(Events.OnSay, stubbedFn)
      const newCmd = onCommandEvent = new OnCommandEvent(
        stubbedUser,
        'attention',
        '!attention',
        viewerFlags(),
        onCommandExtra(),
        activeStream())
      Attention(newCmd)
  
      expect(stubbedFnCalled).to.equal(true)
      expect(stubbedCalledWith).to.not.be.undefined;
      expect(stubbedCalledWith).to.not.be.empty;
      expect(stubbedCalledWith.indexOf(stubbedUser.login)).to.be.greaterThan(-1)
    })

  })

  it('should send sound effect', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, spy)

    Attention(onCommandEvent)

    expect(spy.called).to.equal(true)
  })

  it('should not send events if on cooldown', () => {
    const saySpy = sinon.spy()
    const sfxSpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, sfxSpy)
    emitter.on(Events.OnSay, saySpy)

    onCommandEvent.extra.sinceLastCommand.any = 10

    Attention(onCommandEvent)

    expect(saySpy.called).to.equal(false)
    expect(sfxSpy.called).to.equal(false)
  })

  it('should not send events if on user cooldown', () => {
    const saySpy = sinon.spy()
    const sfxSpy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSoundEffect, sfxSpy)
    emitter.on(Events.OnSay, saySpy)

    onCommandEvent.extra.sinceLastCommand.user = 10

    Attention(onCommandEvent)

    expect(saySpy.called).to.equal(false)
    expect(sfxSpy.called).to.equal(false)
  })
})