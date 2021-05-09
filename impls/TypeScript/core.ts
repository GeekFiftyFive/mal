import { pr_str } from "./printer";
import { MalBoolean, MalInt, MalList, MalNil, MalSymbol, MalType } from "./types";

const checkEquality = (a: MalType, b: MalType) => {
    if (a instanceof MalSymbol && b instanceof MalSymbol) {
        return a.get() === b.get();
    }

    if (a instanceof MalInt && b instanceof MalInt) {
        return a.get() === b.get();
    }

    if (
        a instanceof MalList && b instanceof MalList  && 
        a.getList().length === b.getList().length
    ) {
        for (let i = 0; i < a.getList().length; i++) {
            if (!checkEquality(a.getList()[i], b.getList()[i])) {
                return MalBoolean.false_singleton;
            }
        }

        return MalBoolean.true_singleton;
    }

    if (a instanceof MalBoolean && b instanceof MalBoolean) {
        return MalBoolean.fromJSBool(a === b);
    }

    return MalBoolean.false_singleton;
};

export const ns: Record<string, (...args: MalType[]) => MalType> = {
    '+': (a: MalInt, b: MalInt) => {
        return new MalInt(a.get() + b.get());
    },
    '-': (a: MalInt, b: MalInt) => {
        return new MalInt(a.get() - b.get());
    },
    '/': (a: MalInt, b: MalInt) => {
        return new MalInt(Math.floor(a.get() / b.get()));
    },
    '*': (a: MalInt, b: MalInt) => {
        return new MalInt(a.get() * b.get());
    },
    'prn': (a: MalType) => {
        pr_str(a, true);
        return MalNil.singleton;
    },
    'list': (...args: MalType[]) => {
        const list = new MalList();
        list.add(...args);
        return list;
    },
    'list?': (a: MalType) => {
        return MalBoolean.fromJSBool(a instanceof MalList);
    },
    'empty?': (a: MalType) => {
        return MalBoolean.fromJSBool(a instanceof MalList && a.getList().length === 0);
    },
    'count': (a: MalList) => {
        return new MalInt(a.getList().length);
    },
    '=': checkEquality,
    '<': (a: MalInt, b: MalInt) => {
        return MalBoolean.fromJSBool(a.get() < b.get());
    },
    '<=': (a: MalInt, b: MalInt) => {
        return MalBoolean.fromJSBool(a.get() <= b.get());
    },
    '>': (a: MalInt, b: MalInt) => {
        return MalBoolean.fromJSBool(a.get() > b.get());
    },
    '>=': (a: MalInt, b: MalInt) => {
        return MalBoolean.fromJSBool(a.get() >= b.get());
    },
};
