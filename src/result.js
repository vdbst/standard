function reportError(reason){
    var e = new Error("Uncatched error Result!");
    e.reason = reason;
    e.IS_STD_ERR = true;
    throw e;
}

export function fn (cb) {
    try{
        var r = cb();
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
};

export class Result{

    constructor(state, value){
        this.state = state;
        this.value = value;
        this._errorHandlerRegistered = false;
        setTimeout((() => {if(!this._errorHandlerRegistered) console.warn("unhandled error result!")}), 0)
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
        return this;
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
        return new Result("Ok", result);
    }

    static Err(reason){
        return new Result("Err", reason);
    }
}

export function Ok(result){
    return Result.Ok(result);
}

export function Err(reason){
    return Result.Err(reason);
}
