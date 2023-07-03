import { FiniteAutomaton, State } from "./automaton.js";
import { LexerForREG } from "./lexer.js";
import Parse from "./parser.js";
function main() {
    let lexer = new LexerForREG('[^0-5]');
    let nfa = Parse(lexer) as FiniteAutomaton;
    let ret = nfa.test('6');
    console.log(ret);
}
main();