import { State } from "./automaton";
export class Edge {
    public s: number;
    public e: number;
    public isAny:boolean=false;//默认不是any
    public isEpsilon:boolean=false;//默认不是ε
    public target: State[] = [];
    constructor(s: number, e: number, t?: State) {
        this.s = s;
        this.e = e;
        if (t) {
            this.target.push(t);
        }
    }
    public toString() {
        return `[${this.s},${this.e}]->${this.target}`;
    }
}
export class EdgeSet {
    public edges: Edge[] = [];
    public addEdge(e: Edge) {
        this.edges.push(e);
    }
    public separate() {
        let points: number[] = [];
        for (let e of this.edges) {
            points.push(e.s);
            points.push(e.e);
        }
        points = [...new Set(points)];//去重
        points.sort();
        let ret: Edge[] = [];
        //先暴力切分吧(上查找树进行范围搜索?)
        for (let i = 0; i < points.length - 1; i++) {
            let s = points[i];
            let e = points[i + 1];
            let temporaryEdge = new Edge(s, e);
            let valid = false;
            for (let j = 0; j < this.edges.length; j++) {
                let edge = this.edges[j];
                if (edge.s <= s && edge.e >= e) {//命中
                    valid = true;
                    for (let t of edge.target) {
                        temporaryEdge.target.push(t);
                    }
                }
            }
            if (valid) {
                ret.push(temporaryEdge);
            }
        }
        return ret;
    }
}