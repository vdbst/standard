const sym: (a: string) => { readonly 0: unique symbol }[0] = (a) =>
	Symbol(a) as ReturnType<typeof sym>;

export type TraitType = ReturnType<typeof sym>;

type TTrait = {
	new (description: string): TraitType;
};


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

export const createTrait:(description: string) => { readonly 0: unique symbol }[0] = (description: string) => {
	return new Trait(description) as any;
}