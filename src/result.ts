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
    
    or(handler?: R|Result<R,E>|((...[]) => R|Result<R,E>)): Result<R, E>{
        this._errorHandlerRegistered = true;
        if(this.isErr()){
            let res;
            if(typeof handler === "function"){
                res = (handler as Function)();
            }else{
                res = handler;
            }
            return Ok(res);
        }else{
            return this;
        }
    }

    and(handler?: R|Result<R,E>|((...[]) => R|Result<R,E>)): Result<R, E>{
        this._errorHandlerRegistered = true;
        if(this.isOk()){
            let res;
            if(typeof handler === "function"){
                res = (handler as Function)();
            }else{
                res = handler;
            }
            return Ok(res);
        }else{
            return this;
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

    static Ok<T>(result:  T):Result<T,any>;
    static Ok<T>(result:  Result<T>):Result<T,any>;
    static Ok<T>(result:  Result<T,any>):Result<T,any>{
        if(result === undefined) return Err("no result given to Ok");
        if (typeof result == "object"  && result instanceof Result) {
            return result;
        }else{
            return new Result(ResultState.Ok, result);
        }
    }

    static Err<T>(result:  T):Result<any,T>;
    static Err<T>(result:  Result<T>):Result<any,T>;
    static Err<T>(reason: Result<any,T>|T): Result<any,T|string>{
        if(reason === undefined || reason === null) return new Result(ResultState.Err, "no reason given to Err");
        if (typeof reason == "object" && reason instanceof Result) {
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