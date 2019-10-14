function reportError(reason){
    var e = new Error("Uncatched error Result!");
    e.reason = reason;
    e.IS_STD_ERR = true;
    throw e;
}

export function fn (cb) {
    return function() {
        try{
            var r = cb(...arguments);
            if(r instanceof Result){
                return r;
            }else{
                return Ok(r);
            }
        }catch(ex){
            if(ex && ex.IS_STD_ERR){
                var er = Err(ex.reason);
                er.stack = ex.stack;
                return er;
            }else{
                throw(ex);
            }
        }
    }
};

export class Result{

    constructor(state, value){
        this.state = state;
        this.value = value;
        this._errorHandlerRegistered = false;
        if(process.env.NODE_ENV !== "production"){
            var e = new Error();
            setTimeout((() => {
                if(!this._errorHandlerRegistered){
                    console.warn("unhandled error result!", this.value, e.stack)}
            }), 0)
        }
    }

    is_err(){
        return this.state === "Err";
    }

    is_ok(){
        return this.state === "Ok";
    }

    or_Fail(){
        this._errorHandlerRegistered = true;
        if(this.is_err()){
            reportError(this.value);
        }
        return this.value;
    }
    
    or(handler){
        this._errorHandlerRegistered = true;
        if(this.is_err()){
            return Ok(handler);
        }else{
            return this;
        }
    }
    
    and(handler){
        if(this.is_ok()){
            return Ok(handler);
        }else{
            return this;
        }
    }

    unwrap(){
        this._errorHandlerRegistered = true;
        if(this.state === "Ok"){
            return this.value;
        }else{
            if(typeof this.value === "string"){
                var e = new Error(this.value);
                e.originalStack = this.stack;
                throw e;
            }else{
                var e = new Error(this.value.toString());
                e.originalStack = this.stack;
                throw e;
            }           
        }
    }

    static Ok(result){
        if(result === undefined) return Err("no result given to Ok");
        if(typeof result === "function"){
            var r = result();
            if (typeof r == Object && r instanceof Result) {
                return r;
            }else{
                return new Result("Ok", r);
            }
        }else if (typeof result == Object && result instanceof Result) {
            return result;
        }else{
            return new Result("Ok", result);
        }
    }

    static Err(reason){
        if(reason === undefined) return Err("no reason given to Err");
        if(typeof reason === "function"){
            var r = reason();
            if (typeof r == Object && r instanceof Result) {
                return r;
            }else{
                return new Result("Err", r);
            }
        }else if (typeof reason == Object && reason instanceof Result) {
            return reason;
        }else{
            return new Result("Err", reason);
        }
    }
}

export function Ok(result){
    return Result.Ok(result);
}

export function Err(reason){
    return Result.Err(reason);
}
