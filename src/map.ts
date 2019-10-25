import { Perhaps, Option } from "./option";

export class StdMap<K,V>{

    private internalMap: Map<K,V>;

    constructor();
    constructor(map: Map<K,V>);
    constructor(items: [{key: K, value: V}]);
    constructor(items: [[K, V]]);
    constructor(arg?:  Map<K,V>|[{key: K, value: V}|[K, V]]){
        if(arg === undefined){
            this.internalMap = new Map();
            return;
        }else{
            if(Array.isArray(arg)){
                this.internalMap = new Map();
                for (let index = (0|0); index < arg.length; ++index) {
                    const element = arg[index];
                    if(Array.isArray(element)){
                        this.internalMap.set(element[0], element[1]);
                        return;
                    }else{
                        this.internalMap.set(element.key, element.value);
                        return;
                    }
                }
            }else{
                this.internalMap = arg;
                return;
            }
        }

    }

    get(key: K): Option<V>{
        return Perhaps(this.internalMap.get(key));
    }

    set(key: K, value: V): this{
        this.internalMap.set(key,value);
        return this;
    }

    delete(key: K){
        return this.internalMap.delete(key);
    }

    forEach(callback: (value:V, key:K,  map: this) => void){
        const map = this.internalMap;
        const keys = map.keys();
        let res = keys.next();
        let index = 0|0;
        while (!res.done) {
            let key = (res.value) as K;
            callback(map.get(key) as V,key,this)
            res = keys.next();
            ++index;
        }
    }

    forEachParallel(callback: (value:V, key:K, map: this) => Promise<void>){
        const map = this.internalMap;
        const keys = map.keys();
        let res = keys.next();
        let index = 0|0;
        const promises = [];
        while (!res.done) {
            let key = (res.value) as K;
            promises.push(callback(map.get(key) as V,key,this))
            res = keys.next();
            ++index;
        }
        return Promise.all(promises).then(() => undefined);
    }

    async forEachSequenced(callback: (value:V, key:K, map: this) => Promise<void>){
        const map = this.internalMap;
        const keys = map.keys();
        let res = keys.next();
        let index = 0|0;
        while (!res.done) {
            let key = (res.value) as K;
            await callback(map.get(key) as V,key,this);
            res = keys.next();
            ++index;
        }
    }

    map(callback: (value:V, key:K, map: this) => V): StdMap<K,V>{
        const map = this.internalMap;
        const outMap = new Map<K,V>();
        const keys = map.keys();
        let res = keys.next();
        while (!res.done) {
            let key = (res.value) as K;
            outMap.set(key,callback(map.get(key) as V,key,this));
            res = keys.next();
        }
        return new StdMap(outMap);
    }

    mapParallel(callback: (value:V, key:K, map: this) => Promise<V>): Promise<StdMap<K,V>>{
        const map = this.internalMap;
        const outMap = new Map<K,V>();
        const keys = map.keys();
        let res = keys.next();
        const promises = [];
        while (!res.done) {
            let key = (res.value) as K;
            promises.push(callback(map.get(key) as V,key,this).then((res: V) => outMap.set(key, res)))
            res = keys.next();
        }
        return Promise.all(promises).then(() => new StdMap(outMap));
    }

    async mapSequenced(callback: (value:V, key:K, map: this) => Promise<V>): Promise<StdMap<K,V>>{
        const map = this.internalMap;
        const outMap = new Map<K,V>();
        const keys = map.keys();
        let res = keys.next();
        while (!res.done) {
            let key = (res.value) as K;
            outMap.set(key,await callback(map.get(key) as V,key,this));
            res = keys.next();
        }
        return new StdMap(outMap);
    }
}