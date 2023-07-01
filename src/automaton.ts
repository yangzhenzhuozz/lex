import { Edge } from "./edge.js";

export class State {
    public edges: Edge[] = [];
    public resolver: any[] = [];
    constructor() {
    }
}
//NFA和DFA是同一种数据结构
export class FiniteAutomaton {
    public start: State;
    public end: State;
    constructor(s: State, e: State) {
        this.start = s;
        this.end = e;
    }
    public  test(str: string) {
        let nowStateSet: Set<State> = new Set([this.start]);
        this.closure(nowStateSet);
        for (let ch of str) {
            let nextStates: Set<State> = new Set();
            for (let state of nowStateSet) {
                for (let edge of state.edges) {
                    let charCode = ch.charCodeAt(0);
                    if (edge.isAny) {
                        for (let target of edge.target) {
                            nextStates.add(target);
                        }
                    } else if (charCode >= edge.s && charCode <= edge.e) {
                        for (let target of edge.target) {
                            nextStates.add(target);
                        }
                    }
                }
            }
            nowStateSet = nextStates;
            this.closure(nowStateSet);
        }
        console.log(nowStateSet.has(this.end));

    }
    public closure(states: Set<State>) {
        for (let state of states) {
            for (let edge of state.edges) {
                if (edge.isEpsilon) {
                    for (let t of edge.target) {
                        if (!states.has(t)) {
                            states.add(t);
                        }
                    }
                }
            }
        }
    }
    public toDFA() {

    }
}