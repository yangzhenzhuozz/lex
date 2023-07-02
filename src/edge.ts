import { State } from "./automaton";
export class Edge {
    public s: number;
    public e: number;
    public target: State[] = [];
    constructor(s: number, e: number, t?: State) {
        this.s = s;
        this.e = e;
        if (s > e) {
            throw `start must less than end`;
        }
        if (t != undefined) {
            this.target.push(t);
        }
    }
    public clone(): Edge {
        let ret = new Edge(this.s, this.e);
        for (let t of this.target) {
            ret.target.push(t);
        }
        return ret;
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
    private static mix(edges: Edge[], e: Edge, result: Edge[]) {
        if (edges.length == 0) {
            edges.push(e);
        } else {
            let first = edges.shift()!;
            let loc = this.locationTest(first, e);
            switch (loc) {
                case 'left':
                    result.push(e);
                    result.push(first);
                    break;
                case 'right':
                    result.push(first);
                    result.push(e);
                default://cross

                    break;
            }
        }
    }
    //要求a,b必须有交集，否则计算会出错
    public static corss(a: Edge, b: Edge): Edge[] {
        let ret: Edge[];
        let arr = [a, b].sort((a, b) => {
            if (a.s != b.s) {
                return a.s - b.s;
            } else {
                return a.e - b.e;
            }
        });
        a = arr[0];
        b = arr[1];
        let common: Edge;
        let left: Edge;
        let right: Edge;
        if (a.s == b.s) {//这种返回值小于3
            if (a.e == b.e) {//返回值只有一个
                common = a.clone();
                for (let t of b.target) {
                    common.target.push(t);
                }
                ret = [common];
            } else if (a.e < b.e) {
                common = a.clone();
                for (let t of b.target) {
                    common.target.push(t);
                }
                right = new Edge(a.e + 1, b.e);
                for (let t of b.target) {
                    right.target.push(t);
                }
                ret = [common, right];
            } else {// if (a.e > b.e) 
                common = b.clone();
                for (let t of a.target) {
                    common.target.push(t);
                }
                right = new Edge(b.s + 1, a.e);
                for (let t of a.target) {
                    right.target.push(t);
                }
                ret = [common, right];
            }
        } else {
            if (a.e == b.e) {
                left = new Edge(a.s, b.s - 1);
                for (let t of a.target) {
                    left.target.push(t);
                }
                common = b.clone();
                for (let t of a.target) {
                    common.target.push(t);
                }
                ret = [left, common];
            } else if (a.e < b.e) {
                left = new Edge(a.s, b.s - 1);
                for (let t of a.target) {
                    left.target.push(t);
                }
                common = new Edge(b.s, a.e);
                for (let t of a.target) {
                    common.target.push(t);
                }
                for (let t of b.target) {
                    common.target.push(t);
                }
                right = new Edge(a.e + 1, b.e);
                for (let t of b.target) {
                    right.target.push(t);
                }
                ret = [left, common, right];
            } else {// if (a.e > b.e) 
                left = new Edge(a.s, b.s - 1);
                for (let t of a.target) {
                    left.target.push(t);
                }
                common = b.clone();
                for (let t of a.target) {
                    common.target.push(t);
                }
                right = new Edge(b.e + 1, a.e);
                for (let t of a.target) {
                    right.target.push(t);
                }
                ret = [left, common, right];
            }
        }
        return ret;
    }
    //位置判断
    private static locationTest(ref: Edge, test: Edge): 'left' | 'right' | 'cross' {
        if (test.e < ref.s) {
            return 'left';
        } else if (test.s > ref.e) {
            return 'right';
        } else {
            return 'cross';
        }
    }
    public static reverse(edges: Edge[]): Edge[] {
        throw `unimpliment`;
    }
}