export function assert(condition: any): asserts condition {
    if (!condition) {
        throw `断言失败`;
    }
}