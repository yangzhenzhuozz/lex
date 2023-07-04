import Lexer from "./lexer/lexer.js";
function main() {
    let lexRule: [string, (text: string) => any][] = [
        ['[0-9]\\.[0-9]', (str) => { return str; }],
        ['[0-9]', (str) => { return str; }],
        ['\\.', (str) => { return str; }],
        ['[a-z]', (str) => { return str; }]
    ];
    let EOF = () => { return '文件结束'; };
    let lexer = new Lexer(lexRule, EOF);
    lexer.source = `1.a++`;
    console.log(lexer.test());
    console.log(lexer.test());
    console.log(lexer.test());
    let r = lexer.addRule(['\\+', (str) => { return str; }]);
    console.log(lexer.test());//第一个+能解析，后面的解析失败
    lexer.removeRule(r);
    console.log(lexer.test());
}
main();