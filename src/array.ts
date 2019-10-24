import { Perhaps, Option } from "./option";

export class StdArray<T>{

    private internalArray: Array<T>;

    constructor();
    constructor(items: Array<T>);
    constructor(items?: Array<T>){
        if(items === undefined){
            this.internalArray = [];
            return;
        }else{
            this.internalArray = items;
        }
    }

    get(index: number): Option<T>{
        return Perhaps(this.internalArray[index|0]);
    }

    set(index: number, value: T): this{
        this.internalArray[index|0] = value;
        return this;
    }

    delete(index: number){
        var element: Option<any> = this.splice(index, 1);
        return element.and((element: Array<T>) => element[0]).and((element?: T) => Perhaps(element));
    }

    splice(start:number, count: number): Option<Array<T>>{
        var removed: Array<T>|undefined = this.internalArray.splice(start,count);
        if(removed.length === 0) removed = undefined;
        return Perhaps(removed);
    }


    forEach(callback: (value:T, index: number,  array: this) => void): void{
        const array = this.internalArray;
        for (let index = 0; index < array.length; index++) {
            callback(array[index], index, this);
        }
        return;
    }

    forEachParallel(callback: (value:T, index:number, array: this) => Promise<void>): Promise<void>{
        const promises = [];
        const array = this.internalArray;
        for (let index = 0; index < array.length; index++) {
            promises.push(callback(array[index], index, this));
        }
        return Promise.all(promises).then(() => undefined);
    }

    async forEachSequenced(callback: (value:T, index:number, array: this) => Promise<void>): Promise<void>{
        const array = this.internalArray;
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, this);
        }
        return;
    }

    map<V>(callback: (value:T, index: number,  array: this) => V): StdArray<V>{
        const out = [];
        const array = this.internalArray;
        for (let index = 0; index < array.length; index++) {
            out[index] = callback(array[index], index, this);
        }
    }

    mapParallel<V>(callback: (value:T, index:number, array: this) => Promise<V>): Promise<StdArray<V>>{
        const out: Array<Promise<V>>  = [];
        const array = this.internalArray;
        for (let index = 0; index < array.length; index++) {
            out.push(callback(array[index], index, this));
        }
        return Promise.all(out).then(res => new StdArray(res));
    }

    async mapSequenced<V>(callback: (value:T, index:number, array: this) => Promise<V>): Promise<StdArray<V>>{
        const out: Array<V> = [];
        const array = this.internalArray;
        for (let index = 0; index < array.length; index++) {
            out[index] = await callback(array[index], index, this); 
        }
        return new StdArray(out);
    }
}