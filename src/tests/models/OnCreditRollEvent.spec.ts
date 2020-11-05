import { expect } from 'chai';
import { OnCreditRollEvent } from '../../models/OnCreditRollEvent';
import { credit } from '../test-objects';

describe('Model: OnCreditRollEvent', () => {
    it('should set values in constructor', () => {
        const model = new OnCreditRollEvent([credit()]);
        expect(model.credits).to.not.be.empty;
    })
})