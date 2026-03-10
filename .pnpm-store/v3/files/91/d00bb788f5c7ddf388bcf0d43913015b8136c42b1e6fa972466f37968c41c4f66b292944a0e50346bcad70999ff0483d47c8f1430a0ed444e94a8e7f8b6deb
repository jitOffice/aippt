import { PropType } from 'vue';
import { DataInfo, TransferItem } from './interface';
declare const _default: import("vue").DefineComponent<{
    type: {
        type: PropType<"source" | "target">;
    };
    dataInfo: {
        type: PropType<DataInfo>;
        required: true;
    };
    title: StringConstructor;
    data: {
        type: PropType<TransferItem[]>;
        required: true;
    };
    disabled: BooleanConstructor;
    allowClear: BooleanConstructor;
    selected: {
        type: PropType<string[]>;
        required: true;
    };
    showSearch: BooleanConstructor;
    showSelectAll: BooleanConstructor;
    simple: BooleanConstructor;
    inputSearchProps: {
        type: ObjectConstructor;
    };
}, {
    prefixCls: string;
    filteredData: import("vue").ComputedRef<TransferItem[]>;
    filter: import("vue").Ref<string>;
    checked: import("vue").ComputedRef<boolean>;
    indeterminate: import("vue").ComputedRef<boolean>;
    countSelected: import("vue").ComputedRef<number>;
    countRendered: import("vue").ComputedRef<number>;
    handleSelectAllChange: (checked: boolean) => void;
    handleSearch: (value: string) => void;
    handleClear: () => void;
    transferCtx: import("./context").TransferContext | undefined;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "search"[], "search", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    type?: unknown;
    dataInfo?: unknown;
    title?: unknown;
    data?: unknown;
    disabled?: unknown;
    allowClear?: unknown;
    selected?: unknown;
    showSearch?: unknown;
    showSelectAll?: unknown;
    simple?: unknown;
    inputSearchProps?: unknown;
} & {
    disabled: boolean;
    data: TransferItem[];
    allowClear: boolean;
    simple: boolean;
    dataInfo: DataInfo;
    selected: string[];
    showSearch: boolean;
    showSelectAll: boolean;
} & {
    title?: string | undefined;
    type?: "source" | "target" | undefined;
    inputSearchProps?: Record<string, any> | undefined;
}> & {
    onSearch?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    allowClear: boolean;
    simple: boolean;
    showSearch: boolean;
    showSelectAll: boolean;
}>;
export default _default;
