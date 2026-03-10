import type { ObjectNode, SyntaxError } from './types';
interface ParseResult {
    ast: ObjectNode;
    errors: SyntaxError[];
}
export declare function parseSyntaxToAst(input: string): ParseResult;
export declare function parseInlineKeyValue(value: string): {
    key: string;
    value: string;
} | {
    key: string;
    value: undefined;
} | null;
export {};
