export const  enum ResultState {
    Ok = "Ok",
    Err = "Err",
}

export class Result<R = any,E = any>{
    value?: R;
    readonly state: ResultState;
    error?: E;
    _errorHandlerRegistered = false;
    stack ?: any;

    constructor(state:ResultState.Ok, value: R);
    constructor(state:ResultState.Err, value: E);

    constructor(state: ResultState, value:R|E) {
        this.state = state;
        if(state === ResultState.Ok){
            this.value = value as R;
        }else{
            this.error = value as E;
        }
    }

    private reportError(reason: any){
        let e = new Error("Uncatched error Result!") as any;
        e.reason = reason;
        e.IS_STD_ERR = true;
        e.stack = this.stack;
        e.toString = function() {return (new Error().toString.apply(this)) + ((this.reason)?("\nreason: " + this.reason):"") + ((this.stack)?("\nstack: " + this.stack):"")};
        throw e;
    }    

    isErr(): boolean{
        this._errorHandlerRegistered = true;
        return this.state === ResultState.Err;
    }

    isOk(): boolean{
        return this.state === ResultState.Ok;
    }

    orFail(): Result<R,E> {
        this._errorHandlerRegistered = true;
        if(this.isErr()){
            this.reportError(this.error);
        }
        return this;
    }
    
    or(handler?: R|Result<R,E>): Result<R, E>;
    or(handler?: ((reason?:E) => R|Result<R,E>)): Result<R, E>;
    or(handler?: R|Result<R,E>|((reason?:E) => R|Result<R,E>)): Result<R, E>{
        this._errorHandlerRegistered = true;
        if(this.isErr()){
            let res: any;
            if(typeof handler === "function"){
                res = (handler as (reason?:E) => R|Result<R,E>)(this.error);
            }else{
                res = handler;
            }
            return Ok(res);
        }else{
            return this;
        }
    }

    and(handler?: R|Result<R,E>): Result<R, E>;
    and(handler?: ((result?:R) => R|Result<R,E>)): Result<R, E>;
    and(handler?: R|Result<R,E>|((result:R) => R|Result<R,E>)): Result<R, E>{
        this._errorHandlerRegistered = true;
        if(this.isOk()){
            let res;
            if(typeof handler === "function"){
                res = (handler as Function)(this.value);
            }else{
                res = handler;
            }
            return Ok(res);
        }else{
            return this;
        }
    }

    expect(message: string){
        if(this.isErr()){
            const err = new Error(message);
            (err as any).isExpect = true;
            throw err;
        }
    }

    unwrap(): R {
        this._errorHandlerRegistered = true;
        if(this.state === ResultState.Ok){
            return this.value as R;
        }else{
            // allways throws
            this.reportError(this.error);
            // never executed, just to keep typescript calm...
            /* istanbul ignore next */
            return {} as R;
        }
    }

    static fromCallback<R,E = any>(resolver: (result: Result<R,E>) => any ): (err: E, res: R) => void {
        return (err, res) => {
            if(err) resolver(Err(err))
            else resolver(Ok(res));
        };
    }

    static fromPromise<R,E = any>(promise: Promise<R>): Promise<Result<R,E>>{
        return new Promise(resolve => {
            promise.then(res => resolve(Ok(res))).catch(ex => resolve(Err(ex)));
        });
    }

    static isResult(canidate: any): canidate is Result{
        return typeof canidate === "object" && typeof canidate.isErr === "function" && typeof canidate.isOk === "function";
    }

    static Ok<T>(result:  T):Result<T,any>;
    static Ok<T>(result:  Result<T>):Result<T,any>;
    static Ok<T>(result:  Result<T,any>):Result<T,any>{
        if (Result.isResult(result)){
            return result;
        }else{
            return new Result(ResultState.Ok, result);
        }
    }

    static Err<T>(result:  T):Result<any,T>;
    static Err<T>(result:  Result<T>):Result<any,T>;
    static Err<T>(reason: Result<any,T>|T): Result<any,T|string>{
        if(reason === undefined || reason === null) return new Result(ResultState.Err, "no reason given to Err");
        if (Result.isResult(reason)){
            return reason;
        }else{
            return new Result(ResultState.Err, reason);
        }
    }
}

export function Ok<T>(result:  T):Result<T,any>;
export function Ok<T>(result:  Result<T>):Result<T,any>;
export function Ok<T>(result: (() => T)):Result<T,any>;
export function Ok<T>(result: (() => Result<T,any>)):Result<T,any>;
export function Ok<T>(result: any): Result<any,any>{
    return Result.Ok(result);
}

export function Err<T>(result:  T):Result<any,T>;
export function Err<T>(result:  Result<T>):Result<any,T>;
export function Err<T>(result: (() => T)):Result<any,T>;
export function Err<T>(result: (() => Result<any,T>)):Result<any,T>
export function Err<T>(reason: any):Result<any,T>{
    return Result.Err(reason);
}