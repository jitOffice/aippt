"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootSchema = exports.TemplateSchema = exports.DataSchema = exports.DesignSchema = exports.ThemeSchema = exports.RelationSchema = void 0;
const string = () => ({ kind: 'string' });
const number = () => ({ kind: 'number' });
// const boolean = (): SchemaNode => ({ kind: 'boolean' });
const enumOf = (values) => ({ kind: 'enum', values });
const color = (options = {}) => ({
    kind: 'color',
    soft: options.soft,
});
const array = (item, split = 'any') => ({
    kind: 'array',
    item,
    split,
});
const object = (fields, options = {}) => ({
    kind: 'object',
    fields,
    allowUnknown: options.allowUnknown,
    shorthandKey: options.shorthandKey,
});
const union = (...variants) => ({
    kind: 'union',
    variants,
});
const palette = () => ({ kind: 'palette' });
const anyObject = () => object({}, { allowUnknown: true });
const nullableColorFields = {
    fill: color({ soft: true }),
    stroke: color({ soft: true }),
};
const textStyleSchema = object(nullableColorFields, { allowUnknown: true });
const shapeStyleSchema = object(nullableColorFields, { allowUnknown: true });
const itemDatumSchema = object({}, { allowUnknown: true });
itemDatumSchema.fields = {
    id: string(),
    label: string(),
    value: union(number(), string()),
    desc: string(),
    icon: union(string(), anyObject()),
    illus: union(string(), anyObject()),
    attributes: anyObject(),
    group: string(),
    category: string(),
    children: array(itemDatumSchema),
};
exports.RelationSchema = object({
    id: string(),
    from: string(),
    to: string(),
    label: string(),
    direction: enumOf(['forward', 'both', 'none']),
    showArrow: enumOf(['true', 'false']),
    arrowType: enumOf(['arrow', 'triangle', 'diamond']),
    lineStyle: enumOf(['solid', 'dashed']),
}, { allowUnknown: true });
exports.ThemeSchema = object({
    type: string(),
    colorBg: color(),
    colorPrimary: color(),
    palette: palette(),
    title: textStyleSchema,
    desc: textStyleSchema,
    shape: shapeStyleSchema,
    base: object({
        global: object({}, { allowUnknown: true }),
        shape: shapeStyleSchema,
        text: textStyleSchema,
    }),
    item: object({
        icon: object({}, { allowUnknown: true }),
        label: textStyleSchema,
        desc: textStyleSchema,
        value: textStyleSchema,
        shape: shapeStyleSchema,
    }),
    stylize: object({
        type: enumOf(['rough', 'pattern']),
        roughness: number(),
        bowing: number(),
        fillWeight: number(),
        hachureGap: number(),
        pattern: string(),
        backgroundColor: color(),
        foregroundColor: color(),
        scale: number(),
    }, { shorthandKey: 'type' }),
    elements: object({}, { allowUnknown: true }),
}, { shorthandKey: 'type' });
const designNodeSchema = object({}, { allowUnknown: true, shorthandKey: 'type' });
exports.DesignSchema = object({
    structure: designNodeSchema,
    item: designNodeSchema,
    items: array(designNodeSchema),
    title: designNodeSchema,
});
exports.DataSchema = object({
    title: string(),
    desc: string(),
    items: array(itemDatumSchema),
    lists: array(itemDatumSchema),
    sequences: array(itemDatumSchema),
    root: itemDatumSchema,
    compares: array(itemDatumSchema),
    nodes: array(itemDatumSchema),
    relations: array(exports.RelationSchema),
    values: array(itemDatumSchema),
    order: enumOf(['asc', 'desc']),
    illus: anyObject(),
    attributes: anyObject(),
});
exports.TemplateSchema = object({
    type: string(),
}, { shorthandKey: 'type' });
exports.RootSchema = object({
    template: exports.TemplateSchema,
    design: exports.DesignSchema,
    data: exports.DataSchema,
    theme: exports.ThemeSchema,
    width: union(number(), string()),
    height: union(number(), string()),
});
