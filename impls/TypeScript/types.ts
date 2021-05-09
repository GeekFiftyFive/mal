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

export class MalFunction extends MalType {
    private behaviour: (...args: MalType[]) => MalType;

    constructor(behaviour: (...args: MalType[]) => MalType) {
        super();
        this.behaviour = behaviour;
    }

    exec(...args: MalType[]): MalType {
        return this.behaviour(...args);
    }
}

export class MalBoolean extends MalType {
    private value: boolean;
    static true_singleton = new MalBoolean(true);
    static false_singleton = new MalBoolean(false);

    private constructor(value: boolean) {
        super()
        this.value = value;
    }

    is() {
        return this.value;
    }

    static fromJSBool(value: boolean) {
        if (value) {
            return MalBoolean.true_singleton;
        }

        return MalBoolean.false_singleton;
    }
}

export class MalNil extends MalType {
    public static singleton = new MalNil();

    private constructor() {
        super();
    }
}
