import { read } from 'fs';
import { MalInt, MalList, MalSymbol, MalType } from './types';

export class Reader {
    private position: number;
    private tokens: string[];

    constructor(tokens: string[]) {
        this.tokens = tokens;
        this.position = 0;
    }

    next(): string {
        const token = this.tokens[this.position]
        this.position++;
        return token;
    }

    peek(): string {
        return this.tokens[this.position];
    }

}

const tokenize = (input: string): string[] => {
    const regex = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/gm;
    return [...input.matchAll(regex)].map(match => match[1]);
}

const read_list = (reader: Reader): MalList => {
    const mallist = new MalList();
    reader.next();

    while(reader.peek() !== undefined && reader.peek().charAt(0) != ')') {
        mallist.add(read_form(reader));
    }

    if(reader.next() == undefined) {
        throw new Error('unbalanced');
    }

    return mallist;
}

const read_atom = (reader: Reader): MalType => {
    const token = reader.next();
    const number = parseInt(token);
    let maltype: MalType;

    if (isNaN(number)) {
        maltype = new MalSymbol(token);
    } else {
        maltype = new MalInt(number);
    }

    return maltype;
}

const read_form = (reader: Reader): MalType => {
    const token = reader.peek();
    let maltype: MalType;

    switch (token.charAt(0)) {
        case '(':
            maltype = read_list(reader);
            break;
        default:
            maltype = read_atom(reader);
    }

    return maltype;
}

export const read_str = (input: string) => {
    let tokens: string[] = tokenize(input);
    let reader = new Reader(tokens);
    let maltype: MalType;

    try {
        maltype = read_form(reader);
    } catch (err) {
        console.error(err);
    }

    return maltype;
}
