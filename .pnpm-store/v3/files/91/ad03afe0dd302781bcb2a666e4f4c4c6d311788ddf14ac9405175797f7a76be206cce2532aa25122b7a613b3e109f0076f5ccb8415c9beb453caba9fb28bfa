export type VariableUpdateListeners = {
    id: string;
    onUpdate: () => any;
}[] | undefined;
export type AllVariableUpdateListeners = Record<string, VariableUpdateListeners>;
export type MathVariable = {
    aliases: string[];
    value: number;
};
export type MathVariables = Record<string, MathVariable>;
export declare function evaluateExpression(latex: string, variables: MathVariables, variableListeners: AllVariableUpdateListeners): {
    result: number | undefined;
    definedVariableID: string | undefined;
    variablesUsed: Set<string>;
} | undefined;
