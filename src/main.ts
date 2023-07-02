import { FiniteAutomaton } from "./automaton.js";
import { Edge, EdgeTools } from "./edge.js";
import { LexerForREG } from "./lexer.js";
import Parse from "./parser.js";
function main() {
    let lexer = new LexerForREG('[^a]');
    let nfa = Parse(lexer) as FiniteAutomaton;
    let ret = nfa.test('a');
    console.log(ret);
}
main(); 