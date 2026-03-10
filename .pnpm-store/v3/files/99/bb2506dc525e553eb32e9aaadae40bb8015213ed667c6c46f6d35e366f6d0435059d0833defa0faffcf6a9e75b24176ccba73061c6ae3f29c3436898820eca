/**
 * Get nested property value
 * For example: getNestedValue(obj, 'a.b.c') will return obj.a.b.c
 */
declare function getNestedValue<T>(obj: T, path: keyof T | string): any;
/**
 * Set nested property value
 * For example: setNestedValue(obj, 'a.b.c', value) will set obj.a.b.c = value
 */
declare function setNestedValue<T>(obj: T, path: keyof T | string, value: any): void;
/**
 * Merge objects, but undefined values in source objects will not override existing values
 * @param target - The target object
 * @param sources - Source objects to merge
 * @returns A new merged object
 *
 * @example
 * assignDefined({ a: 1, b: 2 }, { b: undefined, c: 3 })
 * // Returns: { a: 1, b: 2, c: 3 }
 */
declare function assignDefined<T extends object>(target: T, ...sources: Partial<T>[]): T;

export { assignDefined, getNestedValue, setNestedValue };
