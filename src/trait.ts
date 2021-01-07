
class Trait {
	private symbol: symbol;

	constructor(description: string) {
		this.symbol = Symbol(description);
	}

	[Symbol.toPrimitive]() {
		return this.symbol;
	}

	[Symbol.hasInstance](target: any) {
		return typeof target == "object" && target[this.symbol as any] !== undefined;
	}
}

export const createTrait = <T extends string>(description: T) => {

	return new Trait(description) as any as T;
}