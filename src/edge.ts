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
    private static mix(edges: Edge[], index: number, edge: Edge) {
        //需要重新设计算法
        //可以把edge设计成一个队列，每求交一次取一次，如果有剩余内容，把剩下的退回给队列，这样实现好像要简单一些

        if (edges.length == 0) {
            edges.push(edge);
        } else {
            let first = edges.shift()!;
            let loc = this.locationTest(first, edge);
            switch (loc) {
                case 'left':
                    if (index == 0) {
                        edges.unshift(edge);
                    } else {
                        this.mix(edges, index - 1, edge);
                    }
                    break;
                case 'right':
                    if (index == edges.length - 1) {
                        edges.push(edge);
                    } else {
                        this.mix(edges, index + 1, edge);
                    }
                default://cross
                    //需要根据条件往数组中间插入若干值(好像没有完美的数据结构同时完成随机插入和随机取数)
                    let crossProduct = this.corss(first, edge);
                    let leftSurplus = false;
                    let rightSurplus = false;
                    if (first.e < edge.e) {//求交之后还剩余一部分right,需要把right继续混合
                        leftSurplus = true;
                    }
                    if (first.s > edge.s) {//求交之后剩余一部分left，需要向前继续混合
                        rightSurplus = true;
                    }
                    if (!leftSurplus && !rightSurplus) {
                        edges.splice(index, 1, ...crossProduct);//移除原来的元素，并且把交集结果放到原来的位置
                    } else if (!leftSurplus && rightSurplus) {
                        edges.splice(index, 1, ...crossProduct.slice(0, crossProduct.length - 1));//移除原来的元素，并且把交集结果放到原来的位置
                        this.mix(edges, index + crossProduct.length - 1, crossProduct[crossProduct.length - 1]);//把余下的内容向后求交
                    } else if (leftSurplus && !rightSurplus) {
                        edges.splice(index, 1, ...crossProduct.slice(1, crossProduct.length));//移除原来的元素，并且把交集结果放到原来的位置
                        this.mix(edges, index - 1, crossProduct[0]);//把余下的内容向前求交
                    } else if (leftSurplus && rightSurplus) {
                        //这种前后都有的情况需要好好想一下index
                    }
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