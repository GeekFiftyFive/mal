import { MalInt, MalList, MalSymbol, MalType } from "./types";

export const pr_str = (maltype: MalType): string => {
    if (maltype instanceof MalSymbol) {
        return maltype.get()
    }

    if (maltype instanceof MalInt) {
        return maltype.get().toString();
    }

    if (maltype instanceof MalList) {
        return `(${maltype.getList().map(pr_str).join(' ')})`;
    }
};
