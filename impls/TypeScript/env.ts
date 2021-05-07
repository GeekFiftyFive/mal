import { MalType } from './types';

export class Env {
    private data: Record<string, MalType> = {};
    private outer;

    constructor(outer?: Env) {
        this.outer = outer;
    }

    set(key: string, mal: MalType) {
        this.data[key] = mal;
    }

    find(key: string): MalType | undefined {
        const mal = this.data[key];

        if(mal === undefined && this.outer) {
            return this.outer.find(key);
        }

        return mal;
    }

    get(key: string) {
        const mal = this.find(key);

        if (mal === undefined) {
            throw new Error(`${key} not found`);
        }

        return mal;
    }
}
