type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type StopType = string | number | boolean | symbol | undefined | null | ((...args: any[]) => any) | Array<any>;
type Join<K, P> = K extends string | number ? P extends string | number ? `${K}${'' extends P ? '' : '.'}${P}` : never : never;
type ValidKey<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: any;
};
/**
 * 递归生成 T 的所有点语法路径 (例如 "design.structure" 或 "data.items")
 * @template T 目标对象类型
 * @template D 递归深度限制，默认 3 层 (足以覆盖大多数配置嵌套)
 */
export type Path<T, D extends number = 3> = [D] extends [never] ? never : T extends StopType ? never : {
    [K in ValidKey<T>]-?: K extends string | number ? // 生成: 当前路径 K 或 "K + 子路径"
    K | Join<K, Path<NonNullable<T[K]>, Prev[D]>> : never;
}[ValidKey<T>];
export {};
