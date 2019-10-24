import { Option, OptionState, Some, None, Perhaps } from './option';
import { expect } from 'chai';
import 'mocha';

describe("Option",() => {

    describe("Option constructor",() => {

        it('should set Some values', () => {
            const someOption = new Option(OptionState.Some, "All good!");
            expect(someOption.state).to.equal(OptionState.Some);
            expect(someOption.value).to.equal("All good!");
        });
    
        it('should set None values', () => {
            const noneOption = new Option(OptionState.None);
            expect(noneOption.state).to.equal(OptionState.None);
            expect(noneOption.value).to.equal(undefined);
        });
    });
    
    
    describe("Some shorthand",() => {
        it('should set Some values', () => {
            const someOption = Some("All good!");
            expect(someOption.state).to.equal(OptionState.Some);
            expect(someOption.value).to.equal("All good!");
        });
    
        it('should not wrap an existing Some', () => {
            const someOption = Some(Some("All good!"));
            expect(someOption instanceof Option).to.be.true;
            expect((someOption.value as any) instanceof Option).to.be.false;
            expect(someOption.state).to.equal(OptionState.Some);
            expect(someOption.value).to.equal("All good!");
        });
    
        it('should throw on None values', () => {
            const noneOption = new Option(OptionState.None);
            expect(() => Some(noneOption)).to.throw("Called Some with a None Option value");

        });

        it('should throw if there is no value', () => {
            // @ts-ignore
            expect(() => Some()).to.throw("Called Some with a null value");
            expect(() => Some(undefined)).to.throw("Called Some with a null value");
            expect(() => Some(null)).to.throw("Called Some with a null value");
        });
    });
        
    describe("Perhaps shorthand",() => {
        it('should set Some values', () => {
            const someOption = Perhaps("All good!");
            expect(someOption.state).to.equal(OptionState.Some);
            expect(someOption.value).to.equal("All good!");
        });
    
        it('should not wrap an existing Some', () => {
            const option = Perhaps(Some("All good!"));
            expect(option instanceof Option).to.be.true;
            expect((option.value as any) instanceof Option).to.be.false;
            expect(option.state).to.equal(OptionState.Some);
            expect(option.value).to.equal("All good!");
        });

        it('should not wrap an existing None', () => {
            const noneOption = Perhaps(None());
            expect(noneOption instanceof Option).to.be.true;
            expect((noneOption.value as any) instanceof Option).to.be.false;
            expect(noneOption.state).to.equal(OptionState.None);
            expect(noneOption.value).to.be.undefined;
        });
    
        it('should set None values', () => {
            expect(Perhaps().state).to.equal(OptionState.None);
            expect(Perhaps(undefined).state).to.equal(OptionState.None);
            expect(Perhaps(null).state).to.equal(OptionState.None);
        });
    });

    describe("None shorthand",() => {
        it('should set None values', () => {
            const noneOption = None();
            expect(noneOption.state).to.equal(OptionState.None);
            expect(noneOption.value).to.be.undefined;    
        });
    });     

    describe("isSome",() => {
        it('should return true on Some options',() => {
            const someOption = Some("content");
            expect(someOption.isSome()).to.be.true;
        });
        it('should return false on None options',() => {
            const NoneOption = None();
            expect(NoneOption.isSome()).to.be.false;
        });
       
    });

    describe("isNone",() => {
        it('should return true on None options',() => {
            const noneOption = None()
            expect(noneOption.isNone()).to.be.true;
        });
        it('should return false on Some options',() => {
            const SomeOption = Some("content");
            expect(SomeOption.isNone()).to.be.false;
        });
    });

    describe("or",() => {
        it('should return Some options',() => {
            const someOption = Some("All good!");
            expect(someOption.or("false")).to.equal(someOption);
        });
        it('should return hander Option on None options',() => {
            const noneOption = None();
            expect(noneOption.or("But its okay").value).to.equal("But its okay");
        });
        it('should options wrap the return',() => {
            const noneOption = None();
            expect(noneOption.or("But its okay")).to.be.an.instanceof(Option).and.to.have.property("value","But its okay");
        });

        it('should not convert None to Some', () => {
            const someOption = None();
            expect(someOption.or(None())).to.be.an.instanceof(Option);
            expect(someOption.or(() => None()).isNone()).to.be.true;
        });

        it('should execute handler functions',() => {
            const noneOption = None();
            expect(noneOption.or(() => "But its okay")).to.be.an.instanceof(Option).and.to.have.property("value","But its okay");
        });

        it('should return null if no value is given',() => {
            const noneOption = None();
            expect(noneOption.or()).to.be.an.instanceof(Option);
            expect(noneOption.or().isNone()).to.be.true;
        });
        
        it('should not double wrap the return of handler functions',() => {
            const noneOption = None();
            expect(noneOption.or(() => Some("But its okay"))).to.be.an.instanceof(Option).and.to.have.property("value","But its okay");
        });
    });

    describe("and",() => {
        it('should return None options',() => {
            const noneOption = None();
            expect(noneOption.and("false")).to.equal(noneOption);
        });

        it('should return hander Option on Some options',() => {
            const someOption = Some("All good!");
            expect(someOption.and("Even better").value).to.equal("Even better");
        });

        it('should options wrap the return',() => {
            const someOption = Some("All good!");
            expect(someOption.and("Even better")).to.be.an.instanceof(Option).and.to.have.property("value","Even better");
        });

        it('should execute handler functions',() => {
            const someOption = Some("All good!");
            expect(someOption.and(() => "Even better")).to.be.an.instanceof(Option).and.to.have.property("value","Even better");
        });

        it('should not convert None', () => {
            const someOption = Some("All good!");
            expect(someOption.and(None())).to.be.an.instanceof(Option);
            expect(someOption.and(() => None()).isNone()).to.be.true;
        });

        it('should return null if no value is given',() => {
            const someOption = Some("All good!");
            expect(someOption.and()).to.be.an.instanceof(Option);
            expect(someOption.and().isNone()).to.be.true;
        });

        it('should not double wrap the return of handler functions',() => {
            const someOption = Some("All good!");
            expect(someOption.and(() => Some("Even better"))).to.be.an.instanceof(Option).and.to.have.property("value","Even better");
        });
    });

    describe("orFail",() => {
        it('should return options',() => {
            const option = Some('some value');
            expect(option.orFail()).to.be.an.instanceof(Option);
        });

        it('should throw on None options',() => {
            const option = None();
            expect(() => option.orFail()).to.throw("Option has no value");
        });
    });

    describe("unwrap",() => {
        it('should return Option values',() => {
            const option1 = Some('some value');
            const option2 = Some(1337);
            expect(option1.unwrap()).to.equal('some value');
            expect(option2.unwrap()).to.equal(1337);
        });

        it('should throw on None options',() => {
            const option = None();
            expect(() => option.unwrap()).to.throw("Option has no value");
        });
    });

    describe("fromCallback",() => {
    
        it('should create Some options if no error is present',() => {
            let res: Option;
            const resolver = (Option: Option) => {
                res = Option;
            }
            const handler = Option.fromCallback(resolver);
            handler(null, 'success');
            // @ts-ignore
            expect(res.isSome()).to.be.true;
            // @ts-ignore
            expect(res.value).to.equal('success')
        });

        it('should create None options if any error is present',() => {
            let res: Option;
            const resolver = (Option: Option) => {
                res = Option;
            }
            const handler = Option.fromCallback(resolver);
            handler('something bad happend', 'success');
            // @ts-ignore
            expect(res.isNone()).to.be.true;
        });
    });

    describe("fromPromise",() => {
    
        it('should create Some options if no error is present',() => {
            const prom = Promise.resolve('all good!');
            const promise = Option.fromPromise(prom);
            promise.then(res => {
                expect(res.isSome()).to.be.true;
             });
        });

        it('should create None options if any error is present',() => {
            const prom = Promise.reject('something bad happend');
            const promise = Option.fromPromise(prom);
            promise.then(res => {      
                expect(res.isNone()).to.be.true;
            });
        });

        it('should create None options no value is presentt',() => {
            const prom = Promise.resolve();
            const promise = Option.fromPromise(prom);
            promise.then(res => {      
                expect(res.isNone()).to.be.true;
            });
        });
    });    
   
});