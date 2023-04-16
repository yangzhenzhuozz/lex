import { assert } from './util.js';
function EdgeSort(a: Edge, b: Edge): number {
    if (a.s != b.s) {
        return a.s - b.s;
    } else {
        return a.e - b.e;
    }
}
class State {
    static _StateIndex = 0;
    public type: 'end' | 'normal' = 'normal';
    public resolver: (() => any)[] | undefined;
    private _gotoTable: Map<string, Edge> = new Map();//用于记录边表中是否有重复边
    public gotoTable: Edge[] = [];
    public index: number;
    constructor() {
        this.index = State._StateIndex++;
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
    public epsilon_clouser() {
        let ret = new Set<State>();
        ret.add(this);
        for (let s of ret) {
            if (s._gotoTable.has('')) {
                for (let target of s._gotoTable.get('')!.targetSet) {
                    ret.add(target);
                }
            }
        }
        return ret;
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
    public intersect(a: Edge, b: Edge): Edge[] {
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

    /**
     * 把一个Edge添加到现有集合中，会修改原数组
     * @param set 
     * @param edge 
     */
    public static intersectToSet(set: Edge[], edge: Edge) {
        set.sort(EdgeSort);
        throw `unimplement`;
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
/**
 * deterministic finite automaton
 */
class DFA {
    public start: State;
    constructor(nfa: NFA) {
        let stateFamily: Map<string, number> = new Map();
        let startSet = nfa.start.epsilon_clouser();
        stateFamily.set(this.stateSetSign(startSet), 0);
        this.start = new State();
        let edges: Edge[] = [];//时间复杂度是n^2，如果边太多，耗时会很长
        for (let state of startSet) {
            for (let nedge of state.gotoTable) {
                if (edges.length > 0) {
                    for (let edge of edges) {

                    }
                }
            }
        }
    }
    private stateSetSign(s: Set<State>): string {
        let arr = [...s];
        arr.sort((a, b) => a.index - b.index);
        return arr.toString();
    }
    public run() {

    }
}
let nfa = new NFA(new Edge({ s: 97, e: 97, targetSet: [] }), true);
console.log(nfa.run('a'));