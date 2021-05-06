import { MalInt, MalList, MalSymbol, MalType } from "./types";

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
};
