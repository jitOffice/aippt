import type { PropType } from 'vue';
import { TriggerProps } from '../trigger';
import { Data } from '../_utils/types';
import { SelectOptionData, SelectOptionGroup } from './interface';
import { VirtualListProps } from '../_components/virtual-list-v2/interface';
import { ScrollbarProps } from '../scrollbar';
declare const _default: import("vue").DefineComponent<{
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    modelValue: {
        type: PropType<string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]>;
        default: undefined;
    };
    defaultValue: {
        type: PropType<string | number | boolean | Record<string, unknown> | (string | number | boolean | Record<string, unknown>)[]>;
        default: (props: Data) => "" | never[];
    };
    inputValue: {
        type: StringConstructor;
    };
    defaultInputValue: {
        type: StringConstructor;
        default: string;
    };
    size: {
        type: PropType<"mini" | "medium" | "large" | "small">;
    };
    placeholder: StringConstructor;
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    error: {
        type: BooleanConstructor;
        default: boolean;
    };
    allowClear: {
        type: BooleanConstructor;
        default: boolean;
    };
    allowSearch: {
        type: PropType<boolean | {
            retainInputValue?: boolean | undefined;
        }>;
        default: (props: Data) => boolean;
    };
    allowCreate: {
        type: BooleanConstructor;
        default: boolean;
    };
    maxTagCount: {
        type: NumberConstructor;
        default: number;
    };
    popupContainer: {
        type: PropType<string | HTMLElement>;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultActiveFirstOption: {
        type: BooleanConstructor;
        default: boolean;
    };
    popupVisible: {
        type: BooleanConstructor;
        default: undefined;
    };
    defaultPopupVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    unmountOnClose: {
        type: BooleanConstructor;
        default: boolean;
    };
    filterOption: {
        type: PropType<boolean | ((inputValue: string, option: SelectOptionData) => boolean)>;
        default: boolean;
    };
    options: {
        type: PropType<(string | number | boolean | SelectOptionData | SelectOptionGroup)[]>;
        default: () => never[];
    };
    virtualListProps: {
        type: PropType<VirtualListProps>;
    };
    triggerProps: {
        type: PropType<TriggerProps>;
    };
    formatLabel: {
        type: PropType<(data: SelectOptionData) => string>;
    };
    fallbackOption: {
        type: PropType<boolean | ((value: string | number | boolean | Record<string, unknown>) => SelectOptionData)>;
        default: boolean;
    };
    showExtraOptions: {
        type: BooleanConstructor;
        default: boolean;
    };
    valueKey: {
        type: StringConstructor;
        default: string;
    };
    searchDelay: {
        type: NumberConstructor;
        default: number;
    };
    limit: {
        type: NumberConstructor;
        default: number;
    };
    fieldNames: {
        type: PropType<import("../_utils/types").FieldString<SelectOptionData>>;
    };
    scrollbar: {
        type: PropType<boolean | ScrollbarProps>;
        default: boolean;
    };
    showHeaderOnEmpty: {
        type: PropType<boolean>;
        default: boolean;
    };
    showFooterOnEmpty: {
        type: PropType<boolean>;
        default: boolean;
    };
    tagNowrap: {
        type: BooleanConstructor;
        default: boolean;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:modelValue': (value: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]) => true;
    'update:inputValue': (inputValue: string) => true;
    'update:popupVisible': (visible: boolean) => true;
    change: (value: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]) => true;
    inputValueChange: (inputValue: string) => true;
    popupVisibleChange: (visible: boolean) => true;
    clear: (ev: Event) => true;
    remove: (removed: string | number | boolean | Record<string, any> | undefined) => true;
    search: (inputValue: string) => true;
    dropdownScroll: (ev: Event) => true;
    dropdownReachBottom: (ev: Event) => true;
    exceedLimit: (value: string | number | boolean | Record<string, any> | undefined, ev: Event) => true;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    multiple?: unknown;
    modelValue?: unknown;
    defaultValue?: unknown;
    inputValue?: unknown;
    defaultInputValue?: unknown;
    size?: unknown;
    placeholder?: unknown;
    loading?: unknown;
    disabled?: unknown;
    error?: unknown;
    allowClear?: unknown;
    allowSearch?: unknown;
    allowCreate?: unknown;
    maxTagCount?: unknown;
    popupContainer?: unknown;
    bordered?: unknown;
    defaultActiveFirstOption?: unknown;
    popupVisible?: unknown;
    defaultPopupVisible?: unknown;
    unmountOnClose?: unknown;
    filterOption?: unknown;
    options?: unknown;
    virtualListProps?: unknown;
    triggerProps?: unknown;
    formatLabel?: unknown;
    fallbackOption?: unknown;
    showExtraOptions?: unknown;
    valueKey?: unknown;
    searchDelay?: unknown;
    limit?: unknown;
    fieldNames?: unknown;
    scrollbar?: unknown;
    showHeaderOnEmpty?: unknown;
    showFooterOnEmpty?: unknown;
    tagNowrap?: unknown;
} & {
    defaultPopupVisible: boolean;
    disabled: boolean;
    unmountOnClose: boolean;
    scrollbar: boolean | ScrollbarProps;
    multiple: boolean;
    error: boolean;
    allowClear: boolean;
    defaultValue: string | number | boolean | Record<string, unknown> | (string | number | boolean | Record<string, unknown>)[];
    loading: boolean;
    bordered: boolean;
    allowCreate: boolean;
    allowSearch: boolean | {
        retainInputValue?: boolean | undefined;
    };
    maxTagCount: number;
    tagNowrap: boolean;
    defaultInputValue: string;
    filterOption: boolean | ((inputValue: string, option: SelectOptionData) => boolean);
    options: (string | number | boolean | SelectOptionData | SelectOptionGroup)[];
    searchDelay: number;
    valueKey: string;
    defaultActiveFirstOption: boolean;
    fallbackOption: boolean | ((value: string | number | boolean | Record<string, unknown>) => SelectOptionData);
    showExtraOptions: boolean;
    limit: number;
    showHeaderOnEmpty: boolean;
    showFooterOnEmpty: boolean;
} & {
    popupVisible?: boolean | undefined;
    popupContainer?: string | HTMLElement | undefined;
    size?: "mini" | "medium" | "large" | "small" | undefined;
    placeholder?: string | undefined;
    inputValue?: string | undefined;
    modelValue?: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[] | undefined;
    formatLabel?: ((data: SelectOptionData) => string) | undefined;
    fieldNames?: import("../_utils/types").FieldString<SelectOptionData> | undefined;
    triggerProps?: TriggerProps | undefined;
    virtualListProps?: VirtualListProps | undefined;
}> & {
    "onUpdate:popupVisible"?: ((visible: boolean) => any) | undefined;
    onPopupVisibleChange?: ((visible: boolean) => any) | undefined;
    onChange?: ((value: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]) => any) | undefined;
    onClear?: ((ev: Event) => any) | undefined;
    "onUpdate:inputValue"?: ((inputValue: string) => any) | undefined;
    onInputValueChange?: ((inputValue: string) => any) | undefined;
    onRemove?: ((removed: string | number | boolean | Record<string, any> | undefined) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]) => any) | undefined;
    onSearch?: ((inputValue: string) => any) | undefined;
    onDropdownScroll?: ((ev: Event) => any) | undefined;
    onDropdownReachBottom?: ((ev: Event) => any) | undefined;
    onExceedLimit?: ((value: string | number | boolean | Record<string, any> | undefined, ev: Event) => any) | undefined;
}, {
    popupVisible: boolean;
    defaultPopupVisible: boolean;
    disabled: boolean;
    unmountOnClose: boolean;
    scrollbar: boolean | ScrollbarProps;
    multiple: boolean;
    error: boolean;
    allowClear: boolean;
    defaultValue: string | number | boolean | Record<string, unknown> | (string | number | boolean | Record<string, unknown>)[];
    modelValue: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[];
    loading: boolean;
    bordered: boolean;
    allowCreate: boolean;
    allowSearch: boolean | {
        retainInputValue?: boolean | undefined;
    };
    maxTagCount: number;
    tagNowrap: boolean;
    defaultInputValue: string;
    filterOption: boolean | ((inputValue: string, option: SelectOptionData) => boolean);
    options: (string | number | boolean | SelectOptionData | SelectOptionGroup)[];
    searchDelay: number;
    valueKey: string;
    defaultActiveFirstOption: boolean;
    fallbackOption: boolean | ((value: string | number | boolean | Record<string, unknown>) => SelectOptionData);
    showExtraOptions: boolean;
    limit: number;
    showHeaderOnEmpty: boolean;
    showFooterOnEmpty: boolean;
}>;
export default _default;
