import { expect } from 'chai';
import { CommandRegistry } from '../../chat/commandRegistry';
import { Command } from '../../chat/models/Command';
import { OnCommandEvent } from '../../models';

describe('commandRegistry', () => {
    let oldregistry:CommandRegistry = CommandRegistry;
    let gotCalled:boolean = false;
    const stubCommand = (onCommandEvent: OnCommandEvent):void => {
        gotCalled = !!onCommandEvent;
    }
    beforeEach(()=>{
        oldregistry = CommandRegistry;
        (CommandRegistry as any).commands = [new Command('testCommand', stubCommand)];
        console.log((CommandRegistry as any).commands.length);
    })
    it('should not return undefined for a command in the array', () => {
        const cmd = CommandRegistry.getCommand('testCommand');
        expect(cmd).to.not.be.undefined;
    })
    it('should return undefined for a non-existant command', ()=> {
        const cmd = CommandRegistry.getCommand("doesntExist");
        expect(cmd).to.be.undefined;
    })
    it('should return a single entry containing the testCommand', () => {
        const cmds = CommandRegistry.getCommands();
        expect(cmds).to.not.be.empty;
        expect(cmds.length).to.be.equal(1);
        expect(cmds[0].commandName).to.be.equal("testCommand");
    })
    after(() => {
        (CommandRegistry as any) = oldregistry;
    })
})