import { expect } from 'chai'
import sinon from 'sinon'
import 'mocha'

import { Help } from '../../../chat/commands/help'
import { EventBus, Events } from '../../../events'

import { CommandRegistry } from '../../../chat/commandRegistry'
import { Command } from '../../../chat/models/Command'

beforeEach(() => {
  CommandRegistry.init()
})

afterEach(() => {
  EventBus.eventEmitter.removeAllListeners()
})

describe('Commands: Help', () => {

  it('should send message to chat', () => {
    const spy = sinon.spy()
    sinon.stub(CommandRegistry, 'getCommands').callsFake(() => {
      return [
        new Command("first", () => { return }),
        new Command("second", () => { return })
      ]
    })
    const emitter = EventBus.eventEmitter
    emitter.on(Events.OnSay, spy)

    Help()
    
    expect(spy.lastCall.lastArg['message']).to.equal('I can respond to the following commands: !first, !second')
  })

})