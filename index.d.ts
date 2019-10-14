declare module vdbststd{

    export class Result<T>{

        constructor(state: string, value: T): Result<T>
    
        is_err(): boolean;
    
        is_ok(): boolean;
    
        or_Fail(): T;
        
        or(handler): Result<T>;
        
        and(handler): Result<T>;
    
        unwrap(): T | undefined;    

        static Ok<T>(result: T): Result<T>;
    
        static Err<T>(reason: any): Result<T>;
    }

    export function match(subject: any, options: any): any;

    export function Ok<T>(result: T): Result<T>
    
    export function Err(err: any): Result<null>

    export function fn<T>(unpatched: () => T) : Result<T>;
}0