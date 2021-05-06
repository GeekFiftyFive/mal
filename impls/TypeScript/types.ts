export abstract class MalType {};

export class MalList extends MalType {
    private list: MalType[] = [];

    getList(): MalType[] | unknown[] {
        return this.list;
    }

    add(...maltype: MalType[]) {
        this.list.push(...maltype);
    }
};

export class MalInt extends MalType {
    private value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    get(): number {
        return this.value;
    }
}

export class MalSymbol extends MalType {
    private value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    get(): string {
        return this.value;
    }
}
