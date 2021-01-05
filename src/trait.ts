const sym: (a: string) => { readonly 0: unique symbol }[0] = (a) =>
	Symbol(a) as ReturnType<typeof sym>;

export type TraitType = ReturnType<typeof sym>;

type TTrait = {
	new (description: string): TraitType;
};

class ITrait {
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

export const Trait = (ITrait as unknown) as TTrait;
