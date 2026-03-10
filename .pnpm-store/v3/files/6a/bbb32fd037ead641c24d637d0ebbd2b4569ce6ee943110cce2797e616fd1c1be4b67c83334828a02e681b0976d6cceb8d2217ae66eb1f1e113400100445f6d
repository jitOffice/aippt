import { PlainObject } from '../types/common.js';
import { GraphData, Graph } from '../types/data.js';

declare class Supervisor {
    private worker;
    private workerApi;
    /**
     * Execute layout in worker
     */
    execute(layoutId: string, data: GraphData, options: PlainObject): Promise<Graph>;
    /**
     * Destroy worker
     */
    destroy(): void;
    /**
     * Initialize worker
     */
    private initWorker;
    /**
     * Resolve worker script path which works in both ESM and UMD environments
     */
    private resolveWorkerPath;
}

export { Supervisor };
