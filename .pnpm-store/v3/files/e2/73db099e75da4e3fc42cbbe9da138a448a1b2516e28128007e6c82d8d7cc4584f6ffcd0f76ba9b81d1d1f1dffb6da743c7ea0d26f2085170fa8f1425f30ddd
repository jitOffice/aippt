export declare class Extension<T> {
    private extensions;
    register(name: string, extension: T, options?: {
        override?: boolean;
    }): void;
    get(name: string): T | undefined;
    has(name: string): boolean;
    getAll(): ReadonlyMap<string, T>;
    forEach(callback: (extension: T, name: string) => void): void;
    [Symbol.iterator](): MapIterator<[string, T]>;
    unregister(name: string): boolean;
    destroy(): void;
}
