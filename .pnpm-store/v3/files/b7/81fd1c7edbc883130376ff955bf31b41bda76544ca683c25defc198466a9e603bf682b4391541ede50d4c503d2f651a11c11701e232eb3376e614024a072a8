import { type ExportOptions } from '../exporter';
import { InfographicOptions, ParsedInfographicOptions } from '../options';
export declare class Infographic {
    rendered: boolean;
    private emitter;
    private node;
    private editor?;
    private initialOptions;
    private options;
    private parsedOptions;
    constructor(options: string | Partial<InfographicOptions>);
    getOptions(): Partial<InfographicOptions>;
    private setOptions;
    /**
     * Render the infographic into the container
     */
    render(options?: string | Partial<InfographicOptions>): void;
    update(options: string | Partial<InfographicOptions>): void;
    private performRender;
    /**
     * Compose the SVG template
     */
    compose(parsedOptions: ParsedInfographicOptions): SVGSVGElement;
    getTypes(): string | undefined;
    /**
     * Export the infographic to data URL
     * @param options Export option
     * @returns Data URL string of the exported infographic
     * @description This method need to be called after `render()` and in a browser environment.
     */
    toDataURL(options?: ExportOptions): Promise<string>;
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
    destroy(): void;
}
