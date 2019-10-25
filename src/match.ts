import { Result, ResultState, Ok, Err } from './result';
import { Option, OptionState } from './option';


type ResultOptions<T,R> = {Ok: (value:T) => R, Err: (error: any) => R}
                        | {Ok: (value:T) => R, _: (value: any) => R} 
                        | {_: (value:T) => R, Err: (error: any) => R} 
                        | {_: (value:any) => R } 

type OptionOptions<T,R> = {Some: (value:T) => R, None: () => R}
                        | {Some: (value:T) => R, _: (value: any) => R}
                        | {_: (value:any) => R, None: () => R}
                        | {_: (value:any) => R } 


export function match<T = any,R = any>(subject: T, options: {[option: string]:[(value:T) => R]}):R;
export function match<T = any,R = any>(subject: T, options: any):R;
export function match<T,R>(subject: Result<T>, options: ResultOptions<T,R>):R;
export function match<T,R>(subject: Option<T>, options: OptionOptions<T,R>):R;
export function match<T,R>(subject: any, options: {[option: string]:[(value:any) => R]}|any):any{
    if(subject instanceof Result){
        if(subject.isOk()){
            if(options.Ok !== undefined){
                return options.Ok(subject.value);
            }
            subject = subject.value;
        }else{
            if(options.Err !== undefined){
                return options.Err(subject.error);
            }        
            subject = subject.error;
        }
    }else if(subject instanceof Option){
        if(subject.isSome()){
            if(options.Some !== undefined){
                return options.Some(subject.value);
            }
            subject = subject.value;
        }else{
            if(options.None !== undefined){
                return options.None();
            }    
            subject = null;    
        }
    }
    if(subject === null || subject === undefined){
        if(options.null !== undefined){
            return options.null(subject);
        }
    }else if(typeof subject === "boolean"){
        if(options[subject+""]){
            return options[subject+""](subject);
        }
    }else if(typeof subject === "string"){
        if(options[subject]){
            return options[subject](subject);
        }
    }else if(typeof subject === "number"){
        if(options[subject]){
            return options[subject](subject);
        }
    }
    if(options._ !== undefined){
        return  options._(subject);
    }
    return undefined;

}