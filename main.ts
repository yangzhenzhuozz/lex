let s = new Set<number>();
s.add(1);
for (let n of s) {
    if (n < 10) {
        s.add(n + 1);
    }
}
console.log([...s]);