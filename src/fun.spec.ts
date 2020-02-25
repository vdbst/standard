import { Ok, Err, match , Some, None, fun, Result} from './mod';
import { expect } from 'chai';
import 'mocha';
import { Option } from './option';

describe("fun",() => {

    describe("with values",() => {
        it('should return ok results', () => {

            const demo = fun((val) => 10);
            const res = demo();

            expect(res).to.be.an.instanceof(Result);
            expect(res.isOk()).to.be.true;
            expect(res.unwrap()).to.equal(10);
        });
    });

    describe("with results",() => {
        it('should not wrap results', () => {

            const demo = fun((val) => Ok(10));
            const res = demo();

            expect(res).to.be.an.instanceof(Result);
            expect(res.isOk()).to.be.true;
            expect(res.unwrap()).to.equal(10);
        });
    });

    describe("with errors",() => {
        it('should return err values', () => {

            const demo = fun((val) => Err("oh"));
            const res = demo();

            expect(res).to.be.an.instanceof(Result);
            expect(res.isErr()).to.be.true;
            expect(res.error).to.equal("oh");
            expect(() => {res.unwrap()}).to.throw();

        });

        it('should catch errors', () => {

            const demo = fun((val) => {throw new Error("test")});
            let res: Result = Err("no val");
            expect(() => {res = demo()}).to.not.throw();
            expect(res).to.be.an.instanceof(Result);
            expect(res.isErr()).to.be.true;
            expect(res.error).to.equal("Error: test");
        });

        it('should not catch expect errors with Err', () => {
            const demo = fun((val) => Err("test").expect("test to be there"));
            expect(() => {demo()}).to.throw();
        });

        it('should not catch expect errors with None', () => {
            const demo = fun((val) => None().expect("it to be there"));
            expect(() => {demo()}).to.throw();
        });
        
    });

      
});