import { Edge } from "./edge.js";

export class State {
    public edges: Edge[] = [];
    public resolver: any[] = [];
}
//NFA和DFA是同一种数据结构
export class FiniteAutomaton {
    public start: State;
    public end: State;
    constructor(s: State, e: State) {
        this.start = s;
        this.end = e;
    }
    public toDFA() {

    }
}