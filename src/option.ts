
function reportError(reason: any){
    let e = new Error("Uncatched error Result!") as any;
    e.reason = reason;
    e.IS_STD_ERR = true;
    throw e;
}

export const  enum OptionState {
    Some = "Some",
    None = "None",
}

export class Option<T = null>{
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
    
    or(handler?: T|((...[]) => T)): Option<T>{
        this._nullHandlerRegistered = true;
        if(this.isNone()){
            let res;
            if(typeof handler === "function"){
                res = (handler as Function)();
            }else{
                res = handler;
            }
            if(res !== undefined){
                return Some(res)
            }else{
                return None();
            }
        }else{
            return this;
        }
    }
    
    and(handler?: T|((...[]) => T)): Option<T>{
        if(this.isSome()){
            let res;
            if(typeof handler === "function"){
                res = (handler as Function)();
            }else{
                res = handler;
            }           
            if(res !== undefined){
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
            return null;      
        }
    }

    unwrapOrFail():T{
        this._nullHandlerRegistered = true;
        if(this.state === OptionState.Some){
            return this.value as T;
        }else{
            var e = new Error("Option has no value") as any;
            throw e;
        }
    }

    static fromCallback<T>(resolver: (opt: Option<T>) => any ): (err: any, res: any) => void{
        return (err, res) => {
            if(err) resolver(None())
            else resolver((res === undefined)?Some(res):None());
        };
    }

    static fromPromise<T>(promise:Promise<T>): Promise<Option<T>>{
        return new Promise(resolve => {
            promise.then(res => resolve((res === undefined)?Some(res):None())).catch(() => resolve(None()));
        });
    }

    static Some<T>(result: Option<T>|T|undefined): Option<T>{
        if(result === undefined) return None();
        if(typeof result === "function"){
            var r = result();
            if (typeof r == "object" && r instanceof Option) {
                return r;
            }else{
                if(result === undefined) return None() 
                else return new Option(OptionState.Some, r);
            }
        }else if (typeof result == "object"  && result instanceof Option) {
            return result;
        }else{
            return new Option(OptionState.Some, result);
        }
    }

    static None(): Option<any>{
        return new Option();
    }
}

export function Some<T>(result: Option<T>|T|undefined):Option<T>{
    return Option.Some(result);
}

export function None():Option<any>{
    return Option.None();
}