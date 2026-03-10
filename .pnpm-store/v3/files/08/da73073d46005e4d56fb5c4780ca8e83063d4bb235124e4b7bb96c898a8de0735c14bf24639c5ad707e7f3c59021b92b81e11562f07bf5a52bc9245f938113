import type { Icon } from './icons';
export type Button = HTMLButtonElement & IconButtonHandle;
export interface IconButtonProps {
    icon: Icon;
    onClick?: () => void;
    activate?: boolean;
}
export interface IconButtonHandle {
    activate: boolean;
    setActivate: (activate: boolean) => void;
}
export declare const IconButton: ({ icon, onClick, activate, }: IconButtonProps) => Button;
