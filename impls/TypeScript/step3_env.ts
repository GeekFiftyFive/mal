import * as readline from 'readline';
import { read_str } from './reader';
import { pr_str } from './printer';
import { MalFunction, MalInt, MalList, MalSymbol, MalType } from './types';
import { Env } from './env';

process.stdin.setEncoding('utf-8');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const repl_env = new Env();
repl_env.set('+', new MalFunction((a: MalInt, b: MalInt) => {
    return new MalInt(a.get() + b.get());
}));

repl_env.set('-', new MalFunction((a: MalInt, b: MalInt) => {
    return new MalInt(a.get() - b.get());
}));

repl_env.set('*', new MalFunction((a: MalInt, b: MalInt) => {
    return new MalInt(a.get() * b.get());
}));

repl_env.set('/', new MalFunction((a: MalInt, b: MalInt) => {
    return new MalInt(Math.floor(a.get() / b.get()));
}));

const READ = (input: string) => {
    return read_str(input);
};

const eval_ast = (ast: MalType, env: Env): MalType => {
    if (ast instanceof MalSymbol) {
        const symbol = env.get(ast.get());
        if(!symbol) {
            throw new Error(`${ast.get()} undefined`);
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

const group_array = <T>(arr: T[]): T[][] => {
    if(arr.length % 2 !== 0) {
        throw new Error('uneven array length');
    }
    return arr.reduce((acc, val, idx) => {
        if (idx % 2 === 0) {
            acc.push([val]);
        } else {
            acc[acc.length - 1][1] = val;
        }
        return acc;
    }, []);
}

const EVAL = (ast: MalType, env: Env): MalType => {
    try {
        if (ast instanceof MalList) {
            if (ast.getList().length === 0) {
                return ast;
            }

            const first = ast.getList()[0];
            if (first instanceof MalSymbol) {
                switch(first.get()) {
                    case '!def':
                        const key = ast.getList()[1] as MalSymbol;
                        const val = eval_ast(ast.getList()[2], env);
                        env.set(key.get(), val);
                        return val;
                    case 'let*':
                        const newEnv = new Env(env);
                        const bindings = ast.getList()[1] as MalList;
                        const grouped = group_array(bindings.getList() as MalType[]);
                        grouped.forEach(([key, val]) => {
                            let name: string;
                            if (key instanceof MalSymbol) {
                                name = key.get();
                            } else {
                                throw new Error('even value in pair must be symbol');
                            }
                            env.set(name, eval_ast(val, newEnv));
                        });
                        return eval_ast(bindings[2], env);
                }
            }
    
            const evaluated = eval_ast(ast, env) as MalList;
            const op = evaluated.getList()[0] as MalFunction;
            const args = evaluated.getList().slice(1);
            return op.exec(...(args.map((arg) => {
                return EVAL(arg, env);
            })));
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
