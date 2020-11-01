import chai from 'chai';
const expect = chai.expect;
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'mocha';

chai.use(sinonChai);
import { getTime, log } from '../../common';

describe('Common', () => {
    describe('getTime', () => {
        it('should give me current hour and minutes with padding', () => {
            const { hours, minutes } = getTime()
            const date = new Date()
            const rawMinutes = date.getMinutes()
            const rawHours = date.getHours()
            const chours = (rawHours < 10 ? '0' : '') + rawHours.toLocaleString()
            const cminutes = (rawMinutes < 10 ? '0' : '') + rawMinutes.toLocaleString()
            
            expect(chours).to.be.equal(hours);
            expect(cminutes).to.be.equal(minutes);
        })
    })

    describe('log', () => {
        let clock;
        let currEnv;
        before(()=> {
            currEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = "testing";
            sinon.restore();
            clock = sinon.useFakeTimers(new Date(2020,10,29,9,8,0,0))            
        })
        after(() => {
            clock.restore();
            process.env.NODE_ENV = currEnv;
        })
        it('expect console.info to have been called', function() {
            
            sinon.spy(console, 'info');
            log("info", "test");
            expect(console.info).to.have.been.called;
        })
        it('expect console.info to have been called with test', function() {
            const text = "test";
            const msg = "[09:08] " + text;
            log("info", text);
            expect(console.info).to.have.been.calledWithExactly(msg);
        })
        it('expect console.info to have been called with stack-trace in development mode', function() {
            process.env.NODE_ENV = "development";
            const hours = "09";
            const minutes = "08";
            const text = "test";
            log("info", text);
            expect(console.info).to.have.been.calledWithMatch((arg)=> {
                return arg.indexOf(hours) > -1 && arg.indexOf(minutes) > -1 && arg.indexOf("common.spec.ts") > -1;
            });
        })
    })
})