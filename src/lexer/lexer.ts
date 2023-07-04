import { FiniteAutomaton, State } from "./automaton.js";
import { Edge } from "./edge.js";
import { LexerForREG } from "./lexerForREG.js";
import Parse from "./parser.js";
export default class Lexer {
    private rule: [string, (text: string) => any][];
    private nfa: FiniteAutomaton;
    private idx = 0;
    public source: string = '';
    public endOfFile: (() => any);
    private priorityIdx = 0;
    constructor(rule: [string, (text: string) => any][], EOF: (() => any)) {
        this.rule = rule;
        this.endOfFile = EOF;

        let nfas: FiniteAutomaton[] = [];
        for (let r of this.rule) {
            let lexer = new LexerForREG(r[0]);
            let nfa = Parse(lexer) as FiniteAutomaton;
            nfa.end.rule = r[1];
            nfa.end.priority = this.priorityIdx++;
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
    /**
     * 返回值用于后续移除规则,只需要从start移除这条边就行了
     */
    public addRule(r: [string, (text: string) => any]): Edge {
        let lexer = new LexerForREG(r[0]);
        let nfa = Parse(lexer) as FiniteAutomaton;
        nfa.end.rule = r[1];
        nfa.end.priority = this.priorityIdx++;
        let edge = new Edge(-1, -1, nfa.start);
        this.nfa.start.edges.push(edge);
        return edge;
    }
    public removeRule(edge: Edge) {
        let idx = this.nfa.start.edges.indexOf(edge);
        if (idx != -1) {
            this.nfa.start.edges.splice(idx, 1);
        }
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