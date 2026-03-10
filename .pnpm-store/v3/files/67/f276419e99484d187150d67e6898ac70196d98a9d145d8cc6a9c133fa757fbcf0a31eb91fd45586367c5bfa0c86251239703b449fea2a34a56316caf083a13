export type HotkeyOptions = {
    /**
     * 热键监听的目标，默认监听 document。
     */
    target?: Document | HTMLElement;
    /**
     * 额外的过滤逻辑，返回 false 时会跳过本次事件。
     */
    filter?: (event: KeyboardEvent) => boolean;
};
export declare class Hotkey {
    private target;
    private filter?;
    private bindings;
    constructor(options?: HotkeyOptions);
    bind(combo: string | string[], handler: (event: KeyboardEvent) => void): () => void;
    destroy(): void;
    private unbind;
    private handleKeydown;
}
