export type SelectValue = string;
export type SelectOption = {
    label?: string;
    value: SelectValue;
    disabled?: boolean;
    render?: () => HTMLElement;
};
export type SelectProps = {
    options: SelectOption[];
    value?: SelectValue;
    placeholder?: string;
    onChange?: (value: SelectValue, option?: SelectOption) => void;
    renderOption?: (option: SelectOption) => HTMLElement;
    renderLabel?: (option: SelectOption | undefined) => HTMLElement | string | null | undefined;
};
export type SelectHandle = {
    setValue: (value: SelectValue) => void;
    getValue: () => SelectValue | undefined;
    setOptions: (options: SelectOption[]) => void;
    destroy: () => void;
};
export declare function Select(props: SelectProps): HTMLDivElement & SelectHandle;
