import { Result, ResultState, Ok, Err } from './result';
import { expect } from 'chai';
import 'mocha';

describe("Result",() => {

    describe("Result constructor",() => {
        it('should set OK values', () => {
            const okResult = new Result(ResultState.Ok, "All good!");
            expect(okResult.state).to.equal(ResultState.Ok);
            expect(okResult.value).to.equal("All good!");
            expect(okResult.error).to.equal(undefined);
        });
    
        it('should set Err values', () => {
            const errResult = new Result(ResultState.Err, "Something bad happend!");
            expect(errResult.state).to.equal(ResultState.Err);
            expect(errResult.value).to.equal(undefined);
            expect(errResult.error).to.equal("Something bad happend!");
        });
    });
    
    describe("Ok shorthand",() => {
        it('should set OK values', () => {
            const okResult = Ok("All good!");
            expect(okResult.state).to.equal(ResultState.Ok);
            expect(okResult.value).to.equal("All good!");
            expect(okResult.error).to.equal(undefined);
        });
    
        it('should not wrap an existing Ok', () => {
            const okResult = Ok(Ok("All good!"));
            expect(okResult instanceof Result).to.be.true;
            expect((okResult.value as any) instanceof Result).to.be.false;
            expect(okResult.state).to.equal(ResultState.Ok);
            expect(okResult.value).to.equal("All good!");
            expect(okResult.error).to.equal(undefined);
        });
    
        it('should not convert Err to Ok', () => {
            const errResult = new Result(ResultState.Err, "Something bad happend!");
            const notOkResult = Ok(errResult);
            expect(notOkResult.state).to.equal(ResultState.Err);
            expect(notOkResult.value).to.equal(undefined);
            expect(notOkResult.error).to.equal("Something bad happend!");
        });

        it('should return Err if there is no result', () => {
            const result = Ok(undefined);
            expect(result.state).to.equal(ResultState.Err);
            expect(result.error).to.equal("no result given to Ok");

        });
    });
    
    describe("Err shorthand",() => {
        it('should set Err values', () => {
            const errResult = Err("Something bad happend!");
            expect(errResult.state).to.equal(ResultState.Err);
            expect(errResult.value).to.equal(undefined);
            expect(errResult.error).to.equal("Something bad happend!");
    
        });
    
        it('should not wrap an existing Err', () => {
            const errResult = Err(Err("Something bad happend!"));
            expect(errResult instanceof Result).to.be.true;
            expect((errResult.error as any) instanceof Result).to.be.false;
            expect(errResult.state).to.equal(ResultState.Err);
            expect(errResult.value).to.equal(undefined);
            expect(errResult.error).to.equal("Something bad happend!");
        });
    
        it('should return Err if there is no result', () => {
            const result = Err(undefined);
            expect(result.state).to.equal(ResultState.Err);
            expect(result.error).to.equal("no reason given to Err");

            const result2 = Err(null);
            expect(result2.state).to.equal(ResultState.Err);
            expect(result2.error).to.equal("no reason given to Err");
        });

        it('should not convert Ok to Err', () => {
            const okResult = new Result(ResultState.Ok, "All good!");
            const notErrResult = Err(okResult);
            expect(notErrResult.state).to.equal(ResultState.Ok);
            expect(notErrResult.value).to.equal("All good!");
            expect(notErrResult.error).to.equal(undefined);
        });
    });     


    describe("isOk",() => {
        it('should return true on Ok results',() => {
            const okResult = new Result(ResultState.Ok, "All good!");
            expect(okResult.isOk()).to.be.true;
        });
        it('should return false on Err results',() => {
            const errResult = Err("Something bad happend!");
            expect(errResult.isOk()).to.be.false;
        });
       
    });

    describe("isErr",() => {
        it('should return false on Ok results',() => {
            const okResult = Ok("All good!");
            expect(okResult.isErr()).to.be.false;
        });
        it('should return true on Err results',() => {
            const errResult = Err("Something bad happend!");
            expect(errResult.isErr()).to.be.true;
        });
    });

    describe("or",() => {
        it('should return Ok results',() => {
            const okResult = Ok("All good!");
            expect(okResult.or("false")).to.equal(okResult);
        });
        it('should return hander result on Err Results',() => {
            const errResult = Err("Something bad happend!");
            expect(errResult.or("But its okay").value).to.equal("But its okay");
        });
        it('should Results wrap the return',() => {
            const errResult = Err("Something bad happend!");
            expect(errResult.or("But its okay")).to.be.an.instanceof(Result).and.to.have.property("value","But its okay");
        });

        it('should not convert Errors', () => {
            const okResult = Err("Something bad happend!");
            expect(okResult.or(Err("Oh no"))).to.be.an.instanceof(Result).and.to.have.property("error","Oh no");
            expect(okResult.or(() => Err("Oh no")).isErr()).to.be.true;

        });

        it('should execute handler functions',() => {
            const errResult = Err("Something bad happend!");
            expect(errResult.or(() => "But its okay")).to.be.an.instanceof(Result).and.to.have.property("value","But its okay");
        });

        it('should not double wrap the return of handler functions',() => {
            const errResult = Err("Something bad happend!");
            expect(errResult.or(() => Ok("But its okay"))).to.be.an.instanceof(Result).and.to.have.property("value","But its okay");
        });
    });

    describe("and",() => {
        it('should return Err results',() => {
            const errResult = Err("Something bad happend!");
            expect(errResult.and("false")).to.equal(errResult);
        });

        it('should return hander result on Ok Results',() => {
            const okResult = Ok("All good!");
            expect(okResult.and("Even better").value).to.equal("Even better");
        });

        it('should Results wrap the return',() => {
            const okResult = Ok("All good!");
            expect(okResult.and("Even better")).to.be.an.instanceof(Result).and.to.have.property("value","Even better");
        });

        it('should execute handler functions',() => {
            const okResult = Ok("All good!");
            expect(okResult.and(() => "Even better")).to.be.an.instanceof(Result).and.to.have.property("value","Even better");
        });
        it('should not convert Errors', () => {
            const okResult = Ok("All good!");
            expect(okResult.and(Err("Oh no"))).to.be.an.instanceof(Result).and.to.have.property("error","Oh no");
            expect(okResult.and(() => Err("Oh no")).isErr()).to.be.true;

        });
        it('should not double wrap the return of handler functions',() => {
            const okResult = Ok("All good!");
            expect(okResult.and(() => Ok("Even better"))).to.be.an.instanceof(Result).and.to.have.property("value","Even better");
        });
    });

    describe("orFail",() => {
        it('should return results',() => {
            const result = Ok('some value');
            expect(result.orFail()).to.be.an.instanceof(Result);
        });

        it('should throw on Err results',() => {
            const result = Err('some value');
            expect(() => result.orFail()).to.throw("Uncatched error Result!");
        });
    });

    describe("unwrap",() => {
        it('should return Result values',() => {
            const result1 = Ok('some value');
            const result2 = Ok(1337);
            expect(result1.unwrap()).to.equal('some value');
            expect(result2.unwrap()).to.equal(1337);
        });

        it('should throw on Err results',() => {
            const result = Err('some value');
            expect(() => result.unwrap()).to.throw("Uncatched error Result!");
        });
    });

    describe("fromCallback",() => {
    
        it('should create Ok results if no error is present',() => {
            let res: Result;
            const resolver = (result: Result) => {
                res = result;
            }
            const handler = Result.fromCallback(resolver);
            handler(null, 'success');
            // @ts-ignore
            expect(res.isOk()).to.be.true;
            // @ts-ignore
            expect(res.value).to.equal('success')
        });

        it('should create Err results if any error is present',() => {
            let res: Result;
            const resolver = (result: Result) => {
                res = result;
            }
            const handler = Result.fromCallback(resolver);
            handler('something bad happend', 'success');
            // @ts-ignore
            expect(res.isErr()).to.be.true;
            // @ts-ignore
            expect(res.error).to.equal('something bad happend');
        });
    });

    describe("fromPromise",() => {
    
        it('should create Ok results if no error is present',() => {
            const prom = Promise.resolve('all good!');
            const promise = Result.fromPromise(prom);
            promise.then(res => {
                expect(res.isOk()).to.be.true;
                expect(res.value).to.equal('all good!')
            });
        });

        it('should create Err results if any error is present',() => {
            const prom = Promise.reject('something bad happend');
            const promise = Result.fromPromise(prom);
            promise.then(res => {      
                expect(res.isErr()).to.be.true;
                expect(res.error).to.equal('something bad happend');
            });
        });
    });
});