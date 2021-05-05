import { MalInt, MalList, MalSymbol, MalType } from './types';

export class Reader {
    private position: number;
    private tokens: string[];

    constructor(tokens: string[]) {
        this.tokens = tokens;
        console.log(tokens);
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
    return input.match(regex);
}

const read_list = (reader: Reader): MalList => {
    const mallist = new MalList();
    let token: string = reader.next();

    while(reader.peek() !== undefined && reader.peek().charAt(0) != ')') {
        mallist.add(read_form(reader));
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
    const reader = new Reader(tokenize(input));
    return read_form(reader);
}
