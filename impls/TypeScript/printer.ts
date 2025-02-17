import { MalAtom, MalBoolean, MalClosure, MalFunction, MalInt, MalList, MalNil, MalString, MalSymbol, MalType } from "./types";

export const pr_str = (maltype: MalType, print_readably: boolean): string => {
    if (maltype instanceof MalSymbol) {
        return maltype.get()
    }

    if (maltype instanceof MalInt) {
        return maltype.get().toString();
    }

    if (maltype instanceof MalString) {
        if (print_readably) {
            let output = maltype.get().replace(/\n/gm, '\\n');
            return `"${output}"`;
        }

        let output = maltype.get().replace(/\\n/gm, '\n');
        return output;
    }

    if (maltype instanceof MalList) {
        return `(${maltype.getList().map((child) => pr_str(child, print_readably)).join(' ')})`;
    }

    if (maltype instanceof MalBoolean) {
        return `${maltype.is()}`;
    }

    if (maltype instanceof MalAtom) {
        return `(atom ${pr_str(maltype.get(), print_readably)})`;
    }

    if (maltype instanceof MalNil) {
        return 'nil';
    }

    if (maltype instanceof MalFunction || maltype instanceof MalClosure) {
        return '#<function>';
    }
};
