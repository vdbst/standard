
function reportError(reason: string){
    let e = new Error(reason) as any;
    e.reason = reason;
    e.IS_STD_ERR = true;
    throw e;
}   

export const enum OptionState {
    Some = "Some",
    None = "None",
}


export class Option<T = any>{
    value?: T;
    readonly state: OptionState;
    _nullHandlerRegistered = false;

    constructor(state:OptionState.Some, value: T);
    constructor(state:OptionState.None);
    constructor();

    constructor(state?: OptionState, value ?: T) {
        if(state === undefined){
            this.state = OptionState.None;
        }else{
            this.state = state;
        }
        if(state === OptionState.Some){
            this.value = value;
        }
    }


    isNone():boolean{
        this._nullHandlerRegistered = true;
        return this.state === OptionState.None;
    }

    isSome():boolean{
        return this.state === OptionState.Some;
    }

    orFail():Option<T>{
        this._nullHandlerRegistered = true;
        if(this.isNone()){
            reportError("Option has no value");
        }
        return this;
    }
    
    or(handler?: T|Option<T>|(() => T|Option<T>)): Option<T>{
        this._nullHandlerRegistered = true;
        if(this.isNone()){
            let res;
            if(typeof handler === "function"){
                res = (handler as Function)();
            }else{
                res = handler;
            }
            if (typeof res == "object"  && res instanceof Option) {
                return res;
            }
            if(res !== undefined && res !== null){
                return Some(res)
            }else{
                return None();
            }
        }else{
            return this;
        }
    }
    
    and(handler?: T|Option<T>|((value: T) => T|Option<T>)): Option<T>{
        if(this.isSome()){
            let res;
            if(typeof handler === "function"){
                res = (handler as Function)(this.value);
            }else{
                res = handler;
            }           
            if (typeof res == "object"  && res instanceof Option) {
                return res;
            }
            if(res !== undefined && res !== null){
                return Some(res)
            }else{
                return None();
            }
        }else{
            return this;
        }
    }

    unwrap(): T|null{
        this._nullHandlerRegistered = true;
        if(this.state === OptionState.Some){
            return this.value as T;
        }else{
            reportError("Option has no value");
            // never executed, just to keep typescript calm...
            /* istanbul ignore next */
            return null;
        }
    }

    static fromCallback<T>(resolver: (opt: Option<T>) => any ): (err: any, res: any) => void{
        return (err, res) => {
            if(err) resolver(None())
            else resolver(Perhaps(res));
        };
    }

    static fromPromise<T>(promise:Promise<T>): Promise<Option<T>>{
        return new Promise(resolve => {
            promise.then(res => resolve((res === undefined || res === null)?None():Some(res))).catch(() => resolve(None()));
            promise.catch(() => resolve(None()));
        });
    }

    static Some<T>(result: T): Option<T>;
    static Some<T>(result: Option<T>): Option<T>;
    static Some<T>(result: Option<T>|T): Option<T>{
        if(result === undefined || result === null) reportError("Called Some with a null value") ;
        if (typeof result == "object"  && result instanceof Option) {
            if(result.isNone()) reportError("Called Some with a None Option value");
            return result;
        }else{
            return new Option(OptionState.Some, result);
        }
    }

    static None(): Option<any>{
        return new Option();
    }

    static Perhaps<T>(result?: T): Option<T>;
    static Perhaps<T>(result?: Option<T>): Option<T>;
    static Perhaps<T>(result?: T|Option<T>): Option<T>{
        if(result === undefined || result === null) return None();
        if (typeof result == "object"  && result instanceof Option) {
            return result;
        }else{
            return new Option(OptionState.Some, result);
        }
    }
}

export function Some<T>(result: T): Option<T>;
export function Some<T>(result: Option<T>): Option<T>;
export function Some<T>(result: Option<T>|T):Option<T>{
    return Option.Some(result as any);
}

export function None():Option<any>{
    return Option.None();
}

export function Perhaps<T>(result?: T): Option<T>;
export function Perhaps<T>(result?: Option<T>): Option<T>;
export function Perhaps<T>(result?: T|Option<T>): Option<T>{
    return Option.Perhaps(result as any);
}