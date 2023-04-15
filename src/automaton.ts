import { assert } from './util.js';
function EdgeSort(a: Edge, b: Edge): number {
    if (a.s != b.s) {
        return a.s - b.s;
    } else {
        return a.e - b.e;
    }
}
class State {
    public static StateIndex: number = 0;
    public index: number;
    public type: 'end' | 'normal' = 'normal';
    public resolver: (() => any)[] | undefined;
    private _gotoTable: Map<string, Edge> = new Map();//用于记录边表中是否有重复边
    public gotoTable: Edge[] = [];
    constructor() {
        this.index = State.StateIndex++;
    }
    public addEdge(edge: Edge) {
        if (!this._gotoTable.has(edge.sign())) {
            this._gotoTable.set(edge.sign(), edge);
        } else {
            let _edge = this._gotoTable.get(edge.sign());
            assert(_edge != undefined);
            _edge.targetSet = new Set([..._edge.targetSet, ...edge.targetSet]);//合并target
        }
        this.gotoTable.push(edge);
        this.gotoTable.sort(EdgeSort);
    }
    public jmp(ch: number): Set<State> {
        let s = 0;
        let e = this.gotoTable.length - 1;
        for (; ;) {
            if (ch < this.gotoTable[(s + e) / 2].s) {
                if (e == s) {
                    throw `找不到合适的区间`;
                }
                e = (s + e) / 2;
            } else if (ch > this.gotoTable[(s + e) / 2].e) {
                if (e == s) {
                    throw `找不到合适的区间`;
                }
                s = (s + e) / 2;
            } else {
                break;
            }
        }
        return this.gotoTable[(s + e) / 2].targetSet;
    }
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
    public sign() {
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
        let arr = [a, b].sort(EdgeSort);
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
    constructor(e: Edge, isEnd: boolean = false) {
        this.start = new State();
        this.end = new State();
        this.end.type = isEnd ? 'end' : 'normal';
        let targetSet = new Set<State>();
        targetSet.add(this.end);
        e.targetSet.add(this.end);
        this.start.addEdge(e);
    }
    public link(other: NFA, isEnd: boolean = false) {
        this.end.addEdge(new Edge({ s: -1, e: -1, targetSet: [other.start] }));
        this.end = other.end;
        other.end.type = isEnd ? 'end' : 'normal';
    }
    public parallel(other: NFA, isEnd: boolean = false) {
        let newStart = new State();
        let newEnd = new State();

        newStart.addEdge(new Edge({ s: -1, e: -1, targetSet: [this.start, other.start] }));

        this.end.addEdge(new Edge({ s: -1, e: -1, targetSet: [newEnd] }));
        other.end.addEdge(new Edge({ s: -1, e: -1, targetSet: [newEnd] }));

        newEnd.type = isEnd ? 'end' : 'normal';

        this.start = newStart;
        this.end = newEnd;
    }
    public run(str: string): Set<State> {
        let now = new Set<State>([this.start]);
        let target = new Set<State>;
        for (let ch of str) {
            for (let state of now) {
                target = new Set<State>([...state.jmp(ch.charCodeAt(0))]);
            }
            now = target;
        }
        return target;
    }
}
let nfa = new NFA(new Edge({ s: 97, e: 97, targetSet: [] }), true);
console.log(nfa.run('a'));