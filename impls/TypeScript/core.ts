import * as fs from "fs";
import { pr_str } from "./printer";
import { read_str } from "./reader";
import { MalAtom, MalBoolean, MalClosure, MalFunction, MalInt, MalList, MalNil, MalString, MalSymbol, MalType } from "./types";

const checkEquality = (a: MalType, b: MalType) => {
    if (a instanceof MalSymbol && b instanceof MalSymbol) {
        return MalBoolean.fromJSBool(a.get() === b.get());
    }

    if (a instanceof MalInt && b instanceof MalInt) {
        return MalBoolean.fromJSBool(a.get() === b.get());
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

    return MalBoolean.fromJSBool(a === b);
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
    'pr-str': (...args: MalType[]) => {
        return new MalString(args.map((ast) => {
            return pr_str(ast, true)
        }).join(' '));
    },
    'str': (...args: MalType[]) => {
        return new MalString(args.map((ast) => {
            return pr_str(ast, false)
        }).join(''));
    },
    'prn': (...args: MalType[]) => {
        console.log(args.map((ast) => {
            return pr_str(ast, true)
        }).join(' '));
        return MalNil.singleton;
    },
    'println': (...args: MalType[]) => {
        console.log(args.map((ast) => {
            return pr_str(ast, false)
        }).join(' '));
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
    'count': (a: MalType) => {
        if (a instanceof MalList) {
            return new MalInt(a.getList().length);
        }

        return new MalInt(0);
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
    'read-string': (a: MalString) => {
        return read_str(a.get());
    },
    'slurp': (a: MalString) => {
        const filename = a.get();
        const contents = fs.readFileSync(filename, 'utf-8');
        return new MalString(contents);
    },
    'atom': (a: MalType) => {
        return new MalAtom(a);
    },
    'atom?': (a: MalType) => {
        return a instanceof MalAtom;
    },
    'deref': (a: MalAtom) => {
        return a.get();
    },
    'reset!': (atom: MalAtom, mal: MalType) => {
        atom.set(mal);
        return mal;
    },
    'swap!': (atom: MalAtom, func: MalFunction | MalClosure, ...args: MalType[]) => {
        if (func instanceof MalClosure) {
            func = func.getFn();
        }

        args.unshift(atom.get());
        atom.set(func.exec(...args));
        return atom.get();
    }
};
