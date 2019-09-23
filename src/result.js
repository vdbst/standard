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
            return Err(ex.reason);
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
        this.errorCB = () => {};
        this.successCB = () => {};
    }

    is_err(){
        return this.state === "Err";
    }

    is_ok(){
        return this.state === "Ok";
    }

    or_Fail(){
        if(this.is_err()){
            reportError(this.value);
        }
        return this;
    }

    unwrap(){
        if(this.state === "Ok"){
            return this.value;
        }else{
            if(typeof this.value === "string"){
                throw new Error(this.value);

            }else{
                throw new Error(this.value.toString());
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
