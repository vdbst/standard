import { Trait, TraitType } from './mod';
import { expect } from 'chai';
import 'mocha';

describe("Trait",() => {
    const Testable: TraitType = new Trait("test");
    const NotTestable: TraitType = new Trait("test");
    const NotTestableOther: TraitType = new Trait("test with other desc");

    describe("Trait constructor",() => {

        it('should create a functioning trait', () => {
            expect((Testable as any).symbol.toString()).to.equal("Symbol(test)");
            expect((NotTestable as any).symbol.toString()).to.equal("Symbol(test)");
            expect((NotTestableOther as any).symbol.toString()).to.not.equal("Symbol(test)");     
        });
    
    });
    describe("Trait instance",() => {

        it('should access values', () => {            
            const a = {
                [Testable]: "test"
            }
            
            expect(a[Testable]).to.equal("test");
            expect(a[NotTestable]).to.be.undefined;
            expect(a[NotTestableOther]).to.be.undefined;
        });

        it('should validate instances', () => {

            const a = {
                [Testable]: "test"
            }
            
            expect(a instanceof (Testable as any)).to.equal(true);
            expect(a instanceof (NotTestable as any)).to.equal(false);
            expect(a instanceof (NotTestableOther as any)).to.equal(false);
        });
    });
});