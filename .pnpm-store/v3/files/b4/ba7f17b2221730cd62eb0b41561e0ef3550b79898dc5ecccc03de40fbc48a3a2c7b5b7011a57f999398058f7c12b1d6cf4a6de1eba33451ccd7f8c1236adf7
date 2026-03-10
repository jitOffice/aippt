/**
 * 从属性中拆分出组件属性和容器属性
 * @param props
 * @param extKeys
 * @returns
 */
export function getItemProps(props, extKeys = []) {
    const restProps = Object.assign({}, props);
    const extProps = {};
    const keys = [
        'indexes',
        'data',
        'datum',
        'positionH',
        'positionV',
        'themeColors',
        'valueFormatter',
        ...extKeys,
    ];
    keys.forEach((key) => {
        if (key in restProps) {
            extProps[key] = restProps[key];
            delete restProps[key];
        }
    });
    // keep x, y, width, height in rest
    ['x', 'y', 'width', 'height'].forEach((key) => {
        if (key in props) {
            restProps[key] = props[key];
        }
    });
    return [extProps, restProps];
}
/**
 * 针对层级结构，获取当前层级对应的组件
 */
export function getItemComponent(Items, level) {
    var _a;
    if (Items.length === 0)
        return () => null;
    if (level === undefined)
        return Items[0];
    return (_a = Items[level]) !== null && _a !== void 0 ? _a : Items[0];
}
