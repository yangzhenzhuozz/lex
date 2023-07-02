import { FiniteAutomaton, State } from "./automaton.js";
import { Edge, EdgeTools } from "./edge.js";
import { LexerForREG } from "./lexer.js";
import Parse from "./parser.js";
// function main() {
//     let lexer = new LexerForREG('[^a]');
//     let nfa = Parse(lexer) as FiniteAutomaton;
//     let ret = nfa.test('a');
//     console.log(ret);
// }
// main();
let a = new Edge(1, 8, 1 as unknown as State);
let b = new Edge(3, 6, 2 as unknown as State);
let ret = EdgeTools.corss(a, b);
console.table(ret);