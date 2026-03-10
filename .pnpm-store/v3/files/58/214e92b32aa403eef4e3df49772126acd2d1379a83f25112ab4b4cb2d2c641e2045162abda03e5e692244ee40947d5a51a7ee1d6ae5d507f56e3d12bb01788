import tinycolor from 'tinycolor2';
import { parseInlineKeyValue } from './parser.js';
function createValueNode(value, line) {
    return { kind: 'value', line, value };
}
const HEX_COLOR_PATTERN = /^(#[0-9a-f]{8}|#[0-9a-f]{6}|#[0-9a-f]{4}|#[0-9a-f]{3})/i;
const FUNCTION_COLOR_PATTERN = /^((?:rgb|rgba|hsl|hsla)\([^)]*\))/i;
function parseScalar(value) {
    const trimmed = value.trim();
    if (trimmed === 'true')
        return true;
    if (trimmed === 'false')
        return false;
    if (/^-?\d+(\.\d+)?$/.test(trimmed))
        return parseFloat(trimmed);
    return trimmed;
}
function readScalar(node) {
    if (node.kind === 'value')
        return node.value;
    if (node.kind === 'object')
        return node.value;
    return undefined;
}
function addError(errors, node, path, code, message, raw) {
    errors.push({
        path,
        line: node.line,
        code,
        message,
        raw,
    });
}
function splitArrayValue(value, split = 'any') {
    let text = value.trim();
    if (text.startsWith('[') && text.endsWith(']')) {
        text = text.slice(1, -1).trim();
    }
    if (!text)
        return [];
    let parts;
    if (split === 'comma') {
        parts = text.split(',');
    }
    else if (split === 'space') {
        parts = text.split(/\s+/);
    }
    else {
        parts = text.split(/[,\s]+/);
    }
    const normalized = [];
    for (const part of parts) {
        const trimmedPart = part.trim();
        if (!trimmedPart)
            continue;
        if (trimmedPart === '#' || trimmedPart === '//')
            break;
        normalized.push(trimmedPart);
    }
    return normalized;
}
function stripColorComments(value) {
    let trimmed = value.trim();
    const hashIndex = trimmed.search(/\s+#(?![0-9a-f])/i);
    if (hashIndex >= 0) {
        trimmed = trimmed.slice(0, hashIndex).trimEnd();
    }
    const slashIndex = trimmed.indexOf('//');
    if (slashIndex >= 0) {
        trimmed = trimmed.slice(0, slashIndex).trimEnd();
    }
    return trimmed;
}
function normalizeExplicitColor(value) {
    const trimmed = stripColorComments(value);
    if (!trimmed)
        return undefined;
    const hexMatch = trimmed.match(HEX_COLOR_PATTERN);
    if (hexMatch && hexMatch[0].length === trimmed.length) {
        return trimmed;
    }
    const funcMatch = trimmed.match(FUNCTION_COLOR_PATTERN);
    if (funcMatch && funcMatch[1].length === trimmed.length) {
        return trimmed;
    }
    if (tinycolor(trimmed).isValid())
        return trimmed;
    return undefined;
}
function mapColor(node, path, errors, options = {}) {
    const value = readScalar(node);
    if (value === undefined) {
        addError(errors, node, path, 'schema_mismatch', 'Expected color value.');
        return undefined;
    }
    const normalized = normalizeExplicitColor(value);
    if (!normalized) {
        if (!options.soft) {
            addError(errors, node, path, 'invalid_value', 'Invalid color value.', value);
        }
        return undefined;
    }
    return normalized;
}
function shouldTreatPaletteStringAsArray(trimmed, parts) {
    if (parts.length > 1)
        return true;
    if (trimmed.startsWith('[') && trimmed.endsWith(']'))
        return true;
    return normalizeExplicitColor(trimmed) !== undefined;
}
function mapUnknown(node) {
    if (node.kind === 'array') {
        return node.items.map((item) => mapUnknown(item));
    }
    if (node.kind === 'value')
        return parseScalar(node.value);
    const hasEntries = Object.keys(node.entries).length > 0;
    if (!hasEntries && node.value !== undefined) {
        return parseScalar(node.value);
    }
    const result = {};
    if (node.value !== undefined) {
        result.value = parseScalar(node.value);
    }
    Object.entries(node.entries).forEach(([key, child]) => {
        result[key] = mapUnknown(child);
    });
    return result;
}
function mapUnion(node, schema, path, errors) {
    let bestValue = undefined;
    let bestErrors = null;
    for (const variant of schema.variants) {
        const variantErrors = [];
        const value = mapWithSchema(node, variant, path, variantErrors);
        if (bestErrors === null || variantErrors.length < bestErrors.length) {
            bestErrors = variantErrors;
            bestValue = value;
        }
    }
    if (bestErrors)
        errors.push(...bestErrors);
    return bestValue;
}
export function mapWithSchema(node, schema, path, errors) {
    switch (schema.kind) {
        case 'union':
            return mapUnion(node, schema, path, errors);
        case 'string': {
            const value = readScalar(node);
            if (value === undefined) {
                addError(errors, node, path, 'schema_mismatch', 'Expected string value.');
                return undefined;
            }
            return value;
        }
        case 'number': {
            const value = readScalar(node);
            if (value === undefined) {
                addError(errors, node, path, 'schema_mismatch', 'Expected number value.');
                return undefined;
            }
            const trimmed = value.trim();
            const match = trimmed.match(/^(-?\d+(\.\d+)?)(?:\s*(#|\/\/).*)?$/);
            if (!match) {
                addError(errors, node, path, 'invalid_value', 'Invalid number value.', value);
                return undefined;
            }
            return parseFloat(match[1]);
        }
        case 'boolean': {
            const value = readScalar(node);
            if (value === undefined) {
                addError(errors, node, path, 'schema_mismatch', 'Expected boolean value.');
                return undefined;
            }
            if (value !== 'true' && value !== 'false') {
                addError(errors, node, path, 'invalid_value', 'Invalid boolean value.', value);
                return undefined;
            }
            return value === 'true';
        }
        case 'enum': {
            const value = readScalar(node);
            if (value === undefined) {
                addError(errors, node, path, 'schema_mismatch', 'Expected enum value.');
                return undefined;
            }
            if (!schema.values.includes(value)) {
                addError(errors, node, path, 'invalid_value', 'Invalid enum value.', value);
                return undefined;
            }
            return value;
        }
        case 'array': {
            if (node.kind === 'array') {
                return node.items
                    .map((item, index) => mapWithSchema(item, schema.item, `${path}[${index}]`, errors))
                    .filter((value) => value !== undefined);
            }
            if (node.kind === 'object' && Object.keys(node.entries).length > 0) {
                addError(errors, node, path, 'schema_mismatch', 'Expected array value.');
                return undefined;
            }
            const scalar = readScalar(node);
            if (scalar === undefined) {
                addError(errors, node, path, 'schema_mismatch', 'Expected array value.');
                return undefined;
            }
            const trimmed = scalar.trim();
            if (trimmed.startsWith('[') && !trimmed.endsWith(']')) {
                return undefined;
            }
            const parts = splitArrayValue(scalar, schema.split);
            return parts
                .map((part, index) => mapWithSchema(createValueNode(part, node.line), schema.item, `${path}[${index}]`, errors))
                .filter((value) => value !== undefined);
        }
        case 'palette': {
            if (node.kind === 'array') {
                const values = mapWithSchema(node, { kind: 'array', item: { kind: 'color' }, split: 'any' }, path, errors);
                return Array.isArray(values) && values.length > 0 ? values : undefined;
            }
            if (node.kind === 'object' && Object.keys(node.entries).length > 0) {
                addError(errors, node, path, 'schema_mismatch', 'Expected palette value.');
                return undefined;
            }
            const scalar = readScalar(node);
            if (scalar === undefined) {
                addError(errors, node, path, 'schema_mismatch', 'Expected palette value.');
                return undefined;
            }
            const trimmed = scalar.trim();
            if (trimmed.startsWith('[') && !trimmed.endsWith(']')) {
                return undefined;
            }
            const directColor = normalizeExplicitColor(trimmed);
            if (directColor) {
                return [directColor];
            }
            const parts = splitArrayValue(scalar, 'any');
            if (shouldTreatPaletteStringAsArray(trimmed, parts)) {
                const values = parts
                    .map((part, index) => mapColor(createValueNode(part, node.line), `${path}[${index}]`, errors))
                    .filter((value) => value !== undefined);
                return values.length > 0 ? values : undefined;
            }
            return scalar;
        }
        case 'color': {
            return mapColor(node, path, errors, { soft: schema.soft });
        }
        case 'object': {
            if (node.kind === 'array') {
                addError(errors, node, path, 'schema_mismatch', 'Expected object value.');
                return undefined;
            }
            const result = {};
            if (node.kind === 'value') {
                if (schema.shorthandKey) {
                    result[schema.shorthandKey] = node.value;
                    return result;
                }
                const inline = parseInlineKeyValue(node.value);
                if ((inline === null || inline === void 0 ? void 0 : inline.value) !== undefined) {
                    if (schema.fields[inline.key]) {
                        const value = mapWithSchema(createValueNode(inline.value, node.line), schema.fields[inline.key], `${path}.${inline.key}`, errors);
                        if (value !== undefined)
                            result[inline.key] = value;
                        return result;
                    }
                    if (schema.allowUnknown) {
                        result[inline.key] = parseScalar(inline.value);
                        return result;
                    }
                    addError(errors, node, `${path}.${inline.key}`, 'unknown_key', 'Unknown key in object.', inline.key);
                    return result;
                }
                if (schema.allowUnknown) {
                    result.value = parseScalar(node.value);
                    return result;
                }
                addError(errors, node, path, 'invalid_value', 'Expected object value.');
                return undefined;
            }
            if (node.value !== undefined) {
                if (schema.shorthandKey && result[schema.shorthandKey] === undefined) {
                    result[schema.shorthandKey] = node.value;
                }
                else {
                    const inline = parseInlineKeyValue(node.value);
                    if ((inline === null || inline === void 0 ? void 0 : inline.value) !== undefined) {
                        if (schema.fields[inline.key]) {
                            const value = mapWithSchema(createValueNode(inline.value, node.line), schema.fields[inline.key], `${path}.${inline.key}`, errors);
                            if (value !== undefined && result[inline.key] === undefined) {
                                result[inline.key] = value;
                            }
                        }
                        else if (schema.allowUnknown) {
                            result[inline.key] = parseScalar(inline.value);
                        }
                        else {
                            addError(errors, node, `${path}.${inline.key}`, 'unknown_key', 'Unknown key in object.', inline.key);
                        }
                    }
                    else if (schema.allowUnknown) {
                        result.value = parseScalar(node.value);
                    }
                }
            }
            Object.entries(node.entries).forEach(([key, child]) => {
                const fieldSchema = schema.fields[key];
                if (!fieldSchema) {
                    if (schema.allowUnknown) {
                        result[key] = mapUnknown(child);
                        return;
                    }
                    addError(errors, child, `${path}.${key}`, 'unknown_key', 'Unknown key in object.', key);
                    return;
                }
                const value = mapWithSchema(child, fieldSchema, `${path}.${key}`, errors);
                if (value !== undefined)
                    result[key] = value;
            });
            return result;
        }
        default:
            return undefined;
    }
}
export function mapUnknownToObject(node) {
    return mapUnknown(node);
}
