import * as readline from 'readline';
import { read_str } from './reader';
import { pr_str } from './printer';
import { MalBoolean, MalFunction,  MalList, MalNil, MalSymbol, MalType } from './types';
import { Env } from './env';
import { ns } from './core';

process.stdin.setEncoding('utf-8');

const lisp_def = 'def!';
const lisp_let = 'let*';
const lisp_do  = 'do';
const lisp_if  = 'if';
const lisp_fn  = 'fn*';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const repl_env = new Env();

Object.entries(ns).forEach(([key, value]) => {
    repl_env.set(key, new MalFunction(value));
});

const READ = (input: string) => {
    return read_str(input);
};

const eval_ast = (ast: MalType, env: Env): MalType => {
    if (ast instanceof MalSymbol) {
        return env.get(ast.get());
    }

    if (ast instanceof MalList) {
        const list = new MalList();
        list.add(...(ast.getList().map((node) => EVAL(node, env))));
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
    if (ast instanceof MalList) {
        if (ast.getList().length === 0) {
            return ast;
        }
        const first = ast.getList()[0];
        if (first instanceof MalSymbol) {
            switch(first.get()) {
                case lisp_def:
                    const key = ast.getList()[1] as MalSymbol;
                    const val = EVAL(ast.getList()[2], env);
                    env.set(key.get(), val);
                    return val;
                case lisp_let:
                    const letEnv = new Env(env);
                    const bindings = ast.getList()[1] as MalList;
                    const grouped = group_array(bindings.getList() as MalType[]);
                    grouped.forEach(([key, val]) => {
                        let name: string;
                        if (key instanceof MalSymbol) {
                            name = key.get();
                        } else {
                            throw new Error('even value in pair must be symbol');
                        }
                        letEnv.set(name, EVAL(val, letEnv));
                    });
                    return EVAL(ast.getList()[2], letEnv);
                case lisp_do:
                    const do_list = new MalList();
                    do_list.add(...(ast.getList().splice(1)));
                    const do_evaluated = eval_ast(do_list, env) as MalList;
                    return do_evaluated.getList()[do_evaluated.getList().length - 1];
                case lisp_if:
                    const condition = EVAL(ast.getList()[1], env);
                    if (condition instanceof MalNil || (condition instanceof MalBoolean && !condition.is())) {
                        if (ast.getList().length < 4) {
                            return MalNil.singleton;
                        }

                        return EVAL(ast.getList()[3], env);
                    }

                    return EVAL(ast.getList()[2], env);
                case lisp_fn:
                    return new MalFunction((...exprs: MalType[]) => {
                        const binds = (ast.getList()[1] as MalList).getList() as MalSymbol[];
                        const fnEnv = new Env(env, binds, exprs);
                        return EVAL(ast.getList()[2], fnEnv); 
                    });
            }
        }

        const evaluated = eval_ast(ast, env) as MalList;
        const op = evaluated.getList()[0] as MalFunction;
        const args = evaluated.getList().slice(1);
        return op.exec(...(args.map((arg) => {
            return eval_ast(arg, env);
        })));
    }
    return eval_ast(ast, env);
};

const PRINT = (maltype: MalType) => {
    return pr_str(maltype, true);
};

const rep = (arg1: string) => {
    try {
        return PRINT(EVAL(READ(arg1), repl_env));
    } catch (err) {
        return err.message;
    }
};

rl.setPrompt('user> ');
rl.prompt();
rl.on('line', (input: string) => {
    console.log(rep(input));
    rl.prompt();
});
rl.on('close', process.exit);
