import * as readline from 'readline';

process.stdin.setEncoding('utf-8');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const READ = (arg1: string) => {
    return arg1;
};

const EVAL = (arg1: string) => {
    return arg1;
};

const PRINT = (arg1: string) => {
    return arg1;
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
