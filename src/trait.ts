type TTrait = {
    new (description: string): any&symbol;
}


class ITrait{
    private symbol: symbol;

    constructor(description: string){
        this.symbol = Symbol(description);
    }

    [Symbol.toPrimitive]() {
		return this.symbol;
    }

    [Symbol.hasInstance](target: any) {
		return typeof target == 'object' && target[this.symbol as any] !== undefined;
	}
};

export const Trait = ITrait as unknown as TTrait;