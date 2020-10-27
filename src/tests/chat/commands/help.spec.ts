import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Help } from '../../../chat/commands/help'
import { EventBus, Events } from '../../../events'

import { CommandRegistry } from '../../../chat/commandRegistry'

beforeEach(() => {
  CommandRegistry.init()
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Help', () => {

  it('should send message to chat', () => {
    const spy = sinon.spy()

    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    Help()
    
    expect(spy.lastCall.lastArg['message']).to.equal('I can respond to the following commands: attention, awesum, blog, conduct, discord, fart, ffl, font, github, giving, hardware, help, heroines, hype, instagram, keyboard, livecoders, pobox, stop, so, theme, twitter, youtube, jsdefender, store')
  })

})