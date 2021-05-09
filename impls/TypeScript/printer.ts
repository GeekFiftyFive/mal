import { MalBoolean, MalClosure, MalFunction, MalInt, MalList, MalNil, MalSymbol, MalType } from "./types";

export const pr_str = (maltype: MalType, print_readably: boolean): string => {
    if (maltype instanceof MalSymbol) {
        return maltype.get()
    }

    if (maltype instanceof MalInt) {
        return maltype.get().toString();
    }

    if (maltype instanceof MalList) {
        return `(${maltype.getList().map((child) => pr_str(child, print_readably)).join(' ')})`;
    }

    if (maltype instanceof MalBoolean) {
        return `${maltype.is()}`;
    }

    if (maltype instanceof MalNil) {
        return 'nil';
    }

    if (maltype instanceof MalFunction || maltype instanceof MalClosure) {
        return '#<function>';
    }
};
