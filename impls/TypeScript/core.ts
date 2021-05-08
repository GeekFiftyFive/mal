import { MalInt, MalType } from "./types";

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
};
