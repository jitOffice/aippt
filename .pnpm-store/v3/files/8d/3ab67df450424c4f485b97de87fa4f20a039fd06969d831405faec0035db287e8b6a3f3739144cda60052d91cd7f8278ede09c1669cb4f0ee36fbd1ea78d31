import type { BaseItemProps } from '../items/types';
import { BaseStructureProps } from '../structures';
/**
 * 从属性中拆分出组件属性和容器属性
 * @param props
 * @param extKeys
 * @returns
 */
export declare function getItemProps<T extends BaseItemProps>(props: T, extKeys?: string[]): readonly [T, Record<string, any>];
/**
 * 针对层级结构，获取当前层级对应的组件
 */
export declare function getItemComponent(Items: BaseStructureProps['Items'], level?: number): import("../..").ComponentType<Omit<BaseItemProps, "themeColors">>;
