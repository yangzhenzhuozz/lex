import { FiniteAutomaton } from "./automaton.js";
import { LexerForREG } from "./lexer.js";
import Parse from "./parser.js";
function main() {
    let lexer = new LexerForREG('a|b');
    let nfa = Parse(lexer) as FiniteAutomaton;
    console.log(nfa.test('b'));
    ;
}
main(); 