import { FiniteAutomaton } from "./automaton.js";
import { LexerForREG } from "./lexer.js";
import Parse from "./parser.js";
function main() {
    let lexer = new LexerForREG('ab*');
    let nfa = Parse(lexer) as FiniteAutomaton;
    nfa.test('abbbb');
}
main(); 