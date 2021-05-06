import * as readline from 'readline';
import { read_str } from './reader';
import { pr_str } from './printer';
import { MalType } from './types';

process.stdin.setEncoding('utf-8');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const READ = (input: string) => {
    return read_str(input);
};

const EVAL = (maltype: MalType) => {
    return maltype;
};

const PRINT = (maltype: MalType) => {
    return pr_str(maltype, true);
};

const rep = (arg1: string) => {
    return PRINT(EVAL(READ(arg1)));
};

rl.setPrompt('user> ');
rl.prompt();
rl.on('line', (input: string) => {
    console.log(rep(input));
    rl.prompt();
});
rl.on('close', process.exit);
