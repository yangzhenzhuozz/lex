import { Grammar } from "../lib/tscc.js";
import TSCC from "../lib/tscc.js";
let grammar: Grammar = {
    userCode: `import {State,Automaton} from './automaton.js'`,
    accept: ($: any[]) => { return $[0]; },
    tokens: ['(', ')', '[', ']', '*', '|', '-', '^', 'normal_char'],//normal表示没有在前面单独指定的字符
    association: [
        { "nonassoc": ['['] },
        { "nonassoc": ['('] },
        { "left": ['|'] },
        { "left": ['link'] },
        { "left": ['*'] },
        { "nonassoc": ['normal_char'] },
        { "nonassoc": ['priority_parallel'] },//优先级必须比'^'、'-'低，用于[]内部
        { "right": ['-'] },
        { "right": ['^'] },
    ],
    BNF: [
        {
            "exp:( exp )": {}
        },
        {
            "exp:exp | exp": {}
        },
        {
            "exp:exp exp": { priority: "link" }
        },
        {
            "exp:exp *": {}
        },
        {
            "exp:char": {}
        },
        {
            "exp:[ parallel_list ]": {}
        },
        {
            "exp:[ ^ parallel_list ]": {}
        },
        {
            "parallel_list:parallel_char": {}
        },
        {
            "parallel_list:parallel_char char": {}
        },
        {
            "parallel_char:char": { priority: 'priority_parallel'/* 解决 [char - char]的二义性 */ }
        },
        {
            "parallel_char:char - char": {}
        },
        {
            "char:normal_char": {}
        },
        {
            "char:-": {}
        },
        {
            "char:^": {}
        }
    ]
};
let tscc = new TSCC(grammar, { language: "zh-cn", debug: false });
let str = tscc.generate();//构造编译器代码
