export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverPlacementPreference = PopoverPlacement | PopoverPlacement[];
export interface PopoverProps {
    content: HTMLElement | string | (() => HTMLElement | string);
    target?: HTMLElement;
    getContainer?: HTMLElement | (() => HTMLElement);
    placement?: PopoverPlacementPreference;
    padding?: number | string;
    open?: boolean;
    closeOnOutsideClick?: boolean;
    trigger?: 'hover' | 'click' | ('hover' | 'click')[];
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    offset?: number;
}
export interface PopoverHandle {
    setOpen: (open: boolean) => void;
    toggle: () => void;
    setContent: (content: PopoverProps['content']) => void;
    setPlacement: (placement: PopoverPlacementPreference) => void;
    destroy: () => void;
}
export declare function Popover(props: PopoverProps): HTMLDivElement & PopoverHandle;
