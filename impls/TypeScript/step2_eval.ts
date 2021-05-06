import * as readline from 'readline';
import { read_str } from './reader';
import { pr_str } from './printer';
import { MalInt, MalList, MalSymbol, MalType } from './types';

process.stdin.setEncoding('utf-8');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const repl_env = {
    '+': (a:number, b:number) => a + b,
    '-': (a:number, b:number) => a - b,
    '*': (a:number, b:number) => a * b,
    '/': (a:number, b:number) => Math.floor(a / b),
};

const READ = (input: string) => {
    return read_str(input);
};

const eval_ast = (ast: MalType, env: Record<string, unknown>): MalType | ((...args: MalType[]) => MalType) => {
    if (ast instanceof MalSymbol) {
        const symbol = env[ast.get()];
        if(!symbol) {
            throw new Error(`${ast.get()} undefined`);
        }

        if(symbol instanceof Function) {
            return (...args: MalType[]) => {
                const a = EVAL(args[0], env);
                const b = EVAL(args[1], env);

                if(a instanceof MalInt && b instanceof MalInt) {
                    return new MalInt(symbol(a.get(), b.get()));
                } else {
                    throw new Error('unsupported');
                }
            };
        }

        return symbol;
    }

    if (ast instanceof MalList) {
        const list = new MalList();
        list.add(...(ast.getList().map((node) => eval_ast(node, env))));
        return list;
    }

    return ast;
};

const EVAL = (ast: MalType, env: Record<string, unknown>): MalType => {
    try {
        if (ast instanceof MalList) {
            if (ast.getList().length === 0) {
                return ast;
            }
    
            const evaluated = eval_ast(ast, env) as MalList;
            const op = evaluated.getList()[0] as (...args: MalType[]) => MalType;
            const args = evaluated.getList().slice(1);
            return op(...args);
        }
    
        return eval_ast(ast, env);
    } catch (err) {
        console.error(err);
        return ast;
    }
};

const PRINT = (maltype: MalType) => {
    return pr_str(maltype, true);
};

const rep = (arg1: string) => {
    return PRINT(EVAL(READ(arg1), repl_env));
};

rl.setPrompt('user> ');
rl.prompt();
rl.on('line', (input: string) => {
    console.log(rep(input));
    rl.prompt();
});
rl.on('close', process.exit);
