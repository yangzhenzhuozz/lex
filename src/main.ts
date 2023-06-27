import { LexerForREG } from "./lexer.js";
import Parse from "./parser.js";
function main() {
    let lexer = new LexerForREG('[a-z0123]');
    Parse(lexer);
}
main();