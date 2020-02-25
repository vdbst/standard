import { Result, Ok, Err } from './result';


export function fun<T>(callback: (...args: any[] ) => T): () => Result<T>;
export function fun<T>(callback: (...args: any[]) => Result<T>): () => Result<T>;
export function fun<T>(callback: (...args: any[]) => T): () => Result<T>{
    return function(){
        try{
            var r = callback(...arguments);
            if(r instanceof Result){
                return r;
            }else{
                return Ok(r);
            }
        }catch(ex){
            if(ex.isExpect){
                throw ex;
            }
            var er = Err(ex.reason || ex.toString());
            er.stack = ex.stack;
            return er;
        }
    }
}