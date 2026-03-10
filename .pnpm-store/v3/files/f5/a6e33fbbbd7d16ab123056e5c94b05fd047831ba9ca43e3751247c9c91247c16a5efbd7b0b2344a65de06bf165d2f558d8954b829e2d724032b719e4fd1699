export interface ApplyOptionUpdatesOptions {
    /** Whether to notify parent paths of changes (bubbling) */
    bubbleUp?: boolean;
    /** Callback triggered whenever a property value changes */
    collector?: (path: string, newVal: any, oldVal: any) => void;
}
/**
 * Recursively applies properties from 'source' to 'target' and collects changes.
 *
 * @param target - The object to be updated
 * @param source - The source object containing partial updates
 * @param basePath - Current path prefix for nested properties
 * @param options - Configuration options
 */
export declare function applyOptionUpdates(target: any, source: any, basePath?: string, options?: ApplyOptionUpdatesOptions): void;
