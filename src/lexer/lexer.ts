import { FiniteAutomaton, State } from "./automaton.js";
import { Edge } from "./edge.js";
import { LexerForREG } from "./lexerForREG.js";
import Parse from "./parser.js";
export default class Lexer {
    private rule: [string, (text: string) => any][];
    private nfa: FiniteAutomaton | undefined;
    private idx = 0;
    public source: string = '';
    public endOfFile: (() => any);
    constructor(rule: [string, (text: string) => any][], EOF: (() => any)) {
        this.rule = rule;
        this.endOfFile = EOF;
    }
    public compiler(): void {
        let nfas: FiniteAutomaton[] = [];
        for (let i = 0; i < this.rule.length; i++) {
            let r = this.rule[i];
            let lexer = new LexerForREG(r[0]);
            let nfa = Parse(lexer) as FiniteAutomaton;
            nfa.end.rule = r[1];
            nfa.end.priority = i;
            nfas.push(nfa);
        }
        let start = new State();
        let end = new State();
        for (let nfa of nfas) {
            let edge = new Edge(-1, -1, nfa.start);
            start.edges.push(edge);
        }
        this.nfa = new FiniteAutomaton(start, end);
    }
    public test() {
        if (this.idx >= this.source.length) {
            return this.endOfFile();
        }
        if (this.nfa == undefined) {
            throw `has not compiled`;
        }
        let ret = this.nfa.test(this.source, this.idx);
        if (ret == undefined) {
            throw `词法分析失败`;
        }
        this.idx += ret.text.length;
        return ret.rule(ret.text);
    }
}