import * as readline from 'readline';

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
    PRINT(EVAL(READ(arg1)));
};

const handler = () => {
    const exit = false;

    while(!exit) {
        rl.question('user> ', (answer) => {
            console.log(rep(answer));
        });
    }

    rl.close();
};

handler();
