import { Result } from "./result";


export function match(subject, options){
    if(subject instanceof Result){
        if(options.Err) subject._errorHandlerRegistered = true;
        if(subject.is_ok()){
            return options.Ok && options.Ok(subject.value);
        }else{
            return options.Err && options.Err(subject.value);
        }
    }else if(typeof subject === "string"){
        if(options[subject]){
            return options[subject](subject);
        }else{
            return  options._ && options._(subject);
        }
    }else if(typeof subject === "number"){
        if(options[subject]){
            return options[subject](subject);
        }else{
            return  options._ && options._(subject);
        }
    }
}