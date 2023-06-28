import fs from "fs";
import { Grammar } from "./tscc.js";
import TSCC from "./tscc.js";
import { Edge } from "./edge.js";
import { State, FiniteAutomaton } from "./automaton.js";
let grammar: Grammar = {
    userCode: `
import { Edge } from "./edge.js";
import { State, FiniteAutomaton } from "./automaton.js";
`,
    accept: ($: any[]) => { return $[0]; },
    tokens: ['(', ')', '[', ']', '*', '.', '-', '|', '^', 'char'],//normal表示没有在前面单独指定的字符
    association: [
        { "left": ['*'] },
        { "nonassoc": ['['] },
        { "nonassoc": ['('] },
        { "left": ['|'] },
        { "left": ['link'] },//link优先级高于union
        { "nonassoc": ['^'] },
        { "nonassoc": ['-'] },
        { "nonassoc": ['.'] },
        { "nonassoc": ['char'] },
    ],
    BNF: [
        {
            "exp:( exp )": {}//group
        },
        {
            "exp:exp exp": { priority: "link" }//link
        },
        {
            "exp:exp | exp": {}//union
        },
        {
            "exp:exp *": {}//closure
        },
        {
            "exp:element": {
                action: function ($, s): FiniteAutomaton {
                    return $[0] as FiniteAutomaton;
                }
            }
        },
        {
            "element:char": {
                action: function ($, s): FiniteAutomaton {
                    let start = new State();
                    let end = new State();
                    let ch = ($[0] as string).charCodeAt(0);
                    let edge = new Edge(ch, ch);
                    edge.target.push(end);
                    start.edges.push(edge);
                    return new FiniteAutomaton(start, end);
                }
            }
        },
        {
            "element:.": {
                action: function ($, s): FiniteAutomaton {
                    let start = new State();
                    let end = new State();
                    let edge = new Edge(-1, -1);
                    edge.isAny = true;
                    edge.target.push(end);
                    start.edges.push(edge);
                    return new FiniteAutomaton(start, end);
                }
            }
        },
        {
            "element:set": {
                action: function ($, s): FiniteAutomaton {
                    return $[0] as FiniteAutomaton;
                }
            }
        },
        {
            //positive set
            "set:[ set_items ]": {
                action: function ($, s): FiniteAutomaton {
                    let set = $[1] as FiniteAutomaton[];
                    let start = new State();
                    let end = new State();
                    let ret = new FiniteAutomaton(start, end);
                    for (let nfa of set) {
                        let s_edge = new Edge(-1, -1);
                        s_edge.isEpsilon = true;
                        s_edge.target.push(nfa.start);
                        start.edges.push(s_edge);

                        let e_edge = new Edge(-1, -1);
                        e_edge.isEpsilon = true;
                        e_edge.target.push(end);
                        nfa.end.edges.push(e_edge);
                    }
                    return ret;
                }
            }
        },
        {
            //negative set
            "set:[ ^ set_items ]": {
                //有点麻烦,需要把 c-f拆分成两个部分
                action:function($,s){
                    throw `unspprot negative set now`;
                }
            }
        },
        {
            //这里需要用union
            "set_items:set_items set_item": {
                action: function ($, s): FiniteAutomaton[] {
                    let A = $[0] as FiniteAutomaton;
                    let B = $[1] as FiniteAutomaton;
                    return [A, B];
                }
            }
        },
        {
            "set_items:set_item": {
                action: function ($, s): FiniteAutomaton[] {
                    return [$[0] as FiniteAutomaton];
                }
            }
        },
        {
            "set_item:char": {
                action: function ($, s): FiniteAutomaton {
                    let start = new State();
                    let end = new State();
                    start.edges.push(new Edge(($[0] as string).charCodeAt(0), ($[0] as string).charCodeAt(0), end));
                    return new FiniteAutomaton(start, end);
                }
            }
        },
        {
            "set_item:char - char": {
                action: function ($, s): FiniteAutomaton {
                    let start = new State();
                    let end = new State();
                    start.edges.push(new Edge(($[0] as string).charCodeAt(0), ($[1] as string).charCodeAt(0), end));
                    return new FiniteAutomaton(start, end);
                }
            }
        }
    ]
};
let tscc = new TSCC(grammar, { language: "zh-cn", debug: false });
let str = tscc.generate();//构造编译器代码
fs.writeFileSync('./src/parser.ts', str!);