/**
 * 层级结构着色模式类型
 */
export type HierarchyColorMode = 'level' | 'branch' | 'node' | 'node-flat' | 'group';
/**
 * 层级节点信息接口
 */
export interface HierarchyNode {
    /** 节点深度（层级），从 0 开始 */
    depth: number;
    /** 节点原始索引路径，如 [0, 1, 2] 表示根节点的第2个子节点的第3个子节点 */
    originalIndexes: number[];
    /** 节点在树中的扁平化序号（可选），用于 node-flat 模式 */
    flatIndex?: number;
}
/**
 * 根据层级着色模式获取节点的颜色索引
 *
 * @param node - 层级节点信息
 * @param mode - 着色模式
 * @returns 用于获取调色板颜色的索引数组
 *
 * @example
 * ```typescript
 * // 按层级着色
 * const indexes = getHierarchyColorIndexes({ depth: 2, originalIndexes: [0, 1, 2] }, 'level');
 * // 返回 [2]，表示使用第3个层级的颜色
 *
 * // 按分支着色
 * const indexes = getHierarchyColorIndexes({ depth: 3, originalIndexes: [0, 1, 2, 0] }, 'branch');
 * // 返回 [2]，表示继承第2个二级分支的颜色
 *
 * // 按节点着色（层级路径）
 * const indexes = getHierarchyColorIndexes({ depth: 2, originalIndexes: [0, 1, 2] }, 'node');
 * // 返回 [0, 1, 2]，使用完整路径
 *
 * // 按节点着色（扁平序号）
 * const indexes = getHierarchyColorIndexes({ depth: 2, originalIndexes: [0, 1, 2], flatIndex: 5 }, 'node-flat');
 * // 返回 [5]，使用扁平化的序号
 * ```
 */
export declare function getHierarchyColorIndexes(node: HierarchyNode, mode: HierarchyColorMode): number[];
/**
 * 从 d3 hierarchy 节点中提取层级节点信息
 *
 * @param d3Node - d3.hierarchy 生成的节点对象
 * @returns 层级节点信息
 *
 * @example
 * ```typescript
 * const root = d3.hierarchy(data);
 * const nodes = root.descendants();
 *
 * nodes.forEach(node => {
 *   const hierarchyNode = extractHierarchyNode(node);
 *   const colorIndexes = getHierarchyColorIndexes(hierarchyNode, 'branch');
 *   const color = getPaletteColor(options, colorIndexes);
 * });
 * ```
 */
export declare function extractHierarchyNode(d3Node: any): HierarchyNode;
