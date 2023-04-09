interface Edge {
    s: number;
    e: number;
    role: (() => any)[];
}
export class Tools {
    /**
     * 
     * @param a 区间a
     * @param b 区间b
     * @returns intersection:交集,separate各自独立部分
     */
    public static intersect(a: Edge, b: Edge): Edge[] {
        let arr = [a, b].sort((a, b) => {
            if (a.s != b.s) {
                return a.s - b.s;
            } else {
                return a.e - b.e;
            }
        });
        [a, b] = arr;
        if (b.s > a.e) {
            return [a, b];
        } else {
            if (b.e < a.e) {
                if (b.s == a.s) {
                    return [
                        { s: a.s, e: b.e, role: [...a.role, ...b.role] },
                        { s: b.e + 1, e: a.e, role: b.role }
                    ];
                } else {
                    return [
                        { s: a.s, e: b.s - 1, role: a.role },
                        { s: b.s, e: b.e, role: [...a.role, ...b.role] },
                        { s: b.e + 1, e: a.e, role: b.role }
                    ];
                }
            } else if (b.e == a.e) {
                if (b.s == a.s) {
                    return [
                        { s: b.s, e: b.e, role: [...a.role, ...b.role] }
                    ];
                } else {
                    return [
                        { s: a.s, e: b.s - 1, role: a.role },
                        { s: b.s, e: b.e, role: [...a.role, ...b.role] }
                    ];
                }
            } else {
                if (b.s == a.s) {
                    return [
                        { s: a.s, e: a.e, role: [...a.role, ...b.role] },
                        { s: a.e + 1, e: b.e, role: a.role }
                    ];
                } else {
                    return [
                        { s: a.s, e: b.s - 1, role: a.role },
                        { s: b.s, e: a.e, role: [...a.role, ...b.role] },
                        { s: a.e + 1, e: b.e, role: b.role }
                    ];
                }
            }
        }
    }
}