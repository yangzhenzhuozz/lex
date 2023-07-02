import { State } from "./automaton";
export class Edge {
    public s: number;
    public e: number;
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
export class EdgeTools {
    //把边拆分得到一个新集合(保留原来的target)
    public static separate(edges: Edge[]): Edge[] {
        let ret: Edge[] = [];

        return ret;
    }
    //把一个边合并到已经切分且排序好的集合中
    private static mix(edges: Edge[], e: Edge) {

    }
    public static reverse(edges: Edge[]): Edge[] {
        throw `unimpliment`;
    }
}