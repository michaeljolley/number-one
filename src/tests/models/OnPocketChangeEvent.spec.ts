import { expect } from 'chai';
import { OnPocketChangeEvent } from '../../models';

describe('Model: OnPocketChangeEvent', () => {
    it('should result in kidsfed for every 4 dollars.', () => {
        let model = new OnPocketChangeEvent(4);
        expect(model.kidsFed).to.be.equal(1);    
        model = new OnPocketChangeEvent(8);
        expect(model.kidsFed).to.be.equal(2);    
    })
})