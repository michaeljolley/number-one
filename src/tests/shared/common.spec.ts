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
        it('expect console.info to have been called', function() {
            sinon.restore();
            sinon.spy(console, 'info');
            log("info", "test");
            expect(console.info).to.have.been.called;
        })
        it('expect console.info to have been called with test', function() {
            const { hours, minutes } = getTime()
            const text = "test";
            const msg = "[" + hours + ":" + minutes + "] " + text;
            log("info", text);
            expect(console.info).to.have.been.calledWithExactly(msg);
        })
        it('expect console.info to have been called with stack-trace in development mode', function() {
            const currEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = "development";
            const { hours, minutes } = getTime()
            const text = "test";
            log("info", text);
            expect(console.info).to.have.been.calledWithMatch((arg)=> {
                return arg.indexOf(hours) > -1 && arg.indexOf(minutes) > -1 && arg.indexOf("common.spec.ts") > -1;
            });
            process.env.NODE_ENV = currEnv;
        })

    })
})