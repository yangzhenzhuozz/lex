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
            "exp:element": {}
        },
        {
            "element:char": {}
        },
        {
            "element:.": {}
        },
        {
            "element:set": {}
        },
        {
            //positive set
            "set:[ set_items ]": {}
        },
        {
            //negative set
            "set:[ ^ set_items ]": {
                //有点麻烦,需要把 c-f拆分成两个部分
            }
        },
        {
            //这里需要用union
            "set_items:set_items set_item": {
                action: function ($, s): FiniteAutomaton {
                    let A = $[0] as FiniteAutomaton;
                    let B = $[1] as FiniteAutomaton;
                    let start = new State();
                    let end = new State();
                    let tmpEdge: Edge;

                    tmpEdge = new Edge(0, 0, A.start);//连接到A
                    tmpEdge.isEpsilon = true;
                    start.edges.push(tmpEdge);

                    tmpEdge = new Edge(0, 0, B.start);//连接到B
                    tmpEdge.isEpsilon = true;
                    start.edges.push(tmpEdge);

                    tmpEdge = new Edge(0, 0, end);//A连接到end
                    tmpEdge.isEpsilon = true;
                    A.end.edges.push(tmpEdge);

                    tmpEdge = new Edge(0, 0, end);//B连接到end
                    tmpEdge.isEpsilon = true;
                    B.end.edges.push(tmpEdge);

                    return new FiniteAutomaton(start, end);
                }
            }
        },
        {
            "set_items:set_item": {
                action: function ($, s): FiniteAutomaton {
                    return $[0] as FiniteAutomaton;
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