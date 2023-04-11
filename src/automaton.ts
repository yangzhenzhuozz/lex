import { assert } from './util.js';
class State {
    public type: 'end' | 'normal' = 'normal';
    public resolver: (() => any)[] | undefined;
    public gotoTable: Map<string, Edge> = new Map();
}
class Edge {
    public s: number;
    public e: number;
    public targetSet: Set<State>;
    constructor(option: { s: number, e: number, targetSet: State[] }) {
        this.s = option.s;
        this.e = option.e;
        this.targetSet = new Set(option.targetSet);
    }
    public toString() {
        if (this.s == -1) {
            return '';
        } else {
            return `${this.s}-${this.e}`;
        }
    }
    /**
     * 
     * @param a 区间a
     * @param b 区间b
     * @returns intersection:交集,separate各自独立部分
     */
    public static intersect(a: Edge, b: Edge): Edge[] {
        let arr = [a, b].sort((a, b) => {
            if (a.s != b.s) {
                return a.s - b.s;
            } else {
                return a.e - b.e;
            }
        });
        [a, b] = arr;
        if (b.s > a.e) {
            return [a, b];
        } else {
            if (b.e < a.e) {
                if (b.s == a.s) {
                    return [
                        new Edge({ s: a.s, e: b.e, targetSet: [...a.targetSet, ...b.targetSet] }),
                        new Edge({ s: b.e + 1, e: a.e, targetSet: [...b.targetSet] })
                    ];
                } else {
                    return [
                        new Edge({ s: a.s, e: b.s - 1, targetSet: [...a.targetSet] }),
                        new Edge({ s: b.s, e: b.e, targetSet: [...a.targetSet, ...b.targetSet] }),
                        new Edge({ s: b.e + 1, e: a.e, targetSet: [...b.targetSet] })
                    ];
                }
            } else if (b.e == a.e) {
                if (b.s == a.s) {
                    return [
                        new Edge({ s: b.s, e: b.e, targetSet: [...a.targetSet, ...b.targetSet] })
                    ];
                } else {
                    return [
                        new Edge({ s: a.s, e: b.s - 1, targetSet: [...a.targetSet] }),
                        new Edge({ s: b.s, e: b.e, targetSet: [...a.targetSet, ...b.targetSet] })
                    ];
                }
            } else {
                if (b.s == a.s) {
                    return [
                        new Edge({ s: a.s, e: a.e, targetSet: [...a.targetSet, ...b.targetSet] }),
                        new Edge({ s: a.e + 1, e: b.e, targetSet: [...a.targetSet] })
                    ];
                } else {
                    return [
                        new Edge({ s: a.s, e: b.s - 1, targetSet: [...a.targetSet] }),
                        new Edge({ s: b.s, e: a.e, targetSet: [...a.targetSet, ...b.targetSet] }),
                        new Edge({ s: a.e + 1, e: b.e, targetSet: [...b.targetSet] })
                    ];
                }
            }
        }
    }
}
/**
 * non deterministic finite automaton
 */
class NFA {
    public start: State;
    public end: State;
    constructor(e: Edge) {
        this.start = new State();
        this.end = new State();
        this.end.type = 'end';
        let targetSet = new Set<State>();
        targetSet.add(this.end);
        e.targetSet.add(this.end);
        this.start.gotoTable.set(e.toString(), e);
    }
    public link(other: NFA) {
        if (this.end.gotoTable.has('')) {
            let edge = this.end.gotoTable.get('');
            assert(edge != undefined);
            edge.targetSet.add(other.start);
        } else {
            let edge = new Edge({ s: -1, e: -1, targetSet: [other.start] });
            this.end.gotoTable.set('', edge);
        }
    }
    public parallel(other: NFA) {
        let newStart = new State();
        let newEnd = new State();
        
        this.end.type = 'normal';
        other.end.type = 'normal';
        newEnd.type = 'end';

        newStart.gotoTable.set('', new Edge({ s: -1, e: -1, targetSet: [this.start, other.start] }));
        this.end.gotoTable.set('', new Edge({ s: -1, e: -1, targetSet: [newEnd] }));
        other.end.gotoTable.set('', new Edge({ s: -1, e: -1, targetSet: [newEnd] }));

        this.start = newStart;
        this.end = newEnd;
    }
    public run(str: string) {
    }
}
let nfa = new NFA(new Edge({ s: -1, e: -1, targetSet: [] }));
nfa.run('a');