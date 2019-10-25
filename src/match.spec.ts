import { Ok, Err, match , Some, None } from './mod';
import { expect } from 'chai';
import 'mocha';

describe("match",() => {

    describe("with results",() => {
        it('should match Ok values', () => {
            const okResult = Ok("All good!");
            const res = match(okResult, {
                Ok: () => true,
                Err: () => false 
            });
            expect(res).to.be.true;

            const resVal = match(okResult, {
                Ok: (val: any) => val,
                Err: (err: any) => err 
            });
            expect(resVal).to.equal("All good!");
        });
    
        it('should match Err values', () => {
            const errResult = Err("oh no");
            const res = match(errResult, {
                Ok: () => true,
                Err: () => false 
            });
            expect(res).to.be.false;

            const resVal = match(errResult, {
                Ok: (val: any) => val,
                Err: (err: any) => err 
            });
            expect(resVal).to.equal("oh no");
        });

        it('should match _', () => {
            const okResult = Ok("All good!");
            const errResult = Err("oh no");
            const okRes = match(okResult, {
                _: (val:any) => true,
                Err: () => false 
            });

            expect(okRes).to.be.true;
            const errRes = match(errResult, {
                Ok: (val: any) => true,
                _: (err: any) => false 
            });
            expect(errRes).to.be.false;


            const anyOkVal = match(okResult, {
                _: (val: any) => val 
            });
            expect(anyOkVal).to.equal("All good!");

            const anyErrVal = match(errResult, {
                _: (val: any) => val 
            });
            expect(anyErrVal).to.equal("oh no");
        });
    });



    describe("with options",() => {
        it('should match Some values', () => {
            const someOption = Some("All good!");
            const res = match(someOption, {
                Some: () => true,
                None: () => false 
            });
            expect(res).to.be.true;

            const resVal = match(someOption, {
                Some: (val: any) => val,
                None: () => null 
            });
            expect(resVal).to.equal("All good!");
        });
    
        it('should match None values', () => {
            const noneOption = None();
            const res = match(noneOption, {
                Some: () => true,
                None: () => false 
            });
            expect(res).to.be.false;

            const resVal = match(noneOption,{
                Some: (val: any) => val,
                None: (val?: any) => val 
            });
            expect(resVal).to.be.undefined;
        });

        it('should match _', () => {
            const someOption = Some("All good!");
            const noneOption = None();

            const someRes = match(someOption, {
                _: (val:any) => true,
                None: () => false 
            });

            expect(someRes).to.be.true;

            const noneRes = match(noneOption, {
                Some: (val: any) => true,
                _: (err: any) => false 
            });
            
            expect(noneRes).to.be.false;

            const anySomeVal = match(someOption, {
                _: (val: any) => val 
            });
            expect(anySomeVal).to.equal("All good!");

            const anyNoneVal = match(noneOption, {
                _: (val: any) => "test" 
            });
            expect(anyNoneVal).to.equal("test");
        });
        it('should match None with null', () => {
            const noneOption = None();
            const res = match(noneOption, {
                Some: () => true,
                // @ts-ignore
                null: () => false,
            });
            expect(res).to.be.false;
        });
    });


    describe("should match null and undefined",() => {
        it('should match values', () => {
            const unres = match<any,boolean>(undefined as any, {
                _: () => false,
                // @ts-ignore
                null: () => true,
            });

            expect(unres).to.be.true;

            const nullres = match<any,boolean>(null as any, {
                _: () => false,
                // @ts-ignore
                null: () => true,
            });
            expect(nullres).to.be.true;

        });
    });

    describe("should match strings",() => {
        it('should match values', () => {
            const res = match("test", {
                _: () => false,
                "something else": () => false,
                "test": () => true,
            });

            expect(res).to.be.true;
        });
    });

    describe("should match numbers",() => {
        it('should match values', () => {
            const res = match(5, {
                _: () => false,
                6: () => false,
                5: () => true,
            });

            expect(res).to.be.true;
        });
    });

    describe("should match booleans",() => {
        it('should match values', () => {
            const res = match(false, {
                _: () => false,
                true: () => false,
                false: () => true,
            });

            expect(res).to.be.true;
        });
    });

    describe("should return undefined if unmatched",() => {
        it('should not match numbers', () => {
            const res = match(5, {
                6: () => false,
                4: () => true,
            });

            expect(res).to.be.undefined;
        });

        it('should not match numbers', () => {
            const res = match("test", {
                "other": () => false,
                4: () => true,
            });

            expect(res).to.be.undefined;
        });

        it('should not match bools', () => {
            const res = match(false, {
                true: () => false,
                4: () => true,
            });

            expect(res).to.be.undefined;
        });

        it('should not match bs', () => {
            const res = match({}, {
                true: () => false,
                4: () => true,
            });

            expect(res).to.be.undefined;
        });
    });
});