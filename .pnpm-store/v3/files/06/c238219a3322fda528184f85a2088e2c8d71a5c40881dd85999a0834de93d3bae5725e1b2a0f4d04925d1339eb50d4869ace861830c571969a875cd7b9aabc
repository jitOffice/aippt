import type { App } from 'vue';
import type { ArcoOptions } from '../_utils/types';
import _Input from './input';
import _InputSearch from './input-search';
import _InputPassword from './input-password';
import _InputGroup from './input-group';
declare const Input: {
    new (...args: any[]): {
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            disabled: boolean;
            type: "text" | "password";
            readonly: boolean;
            error: boolean;
            allowClear: boolean;
            defaultValue: string;
            maxLength: number | {
                length: number;
                errorOnly?: boolean | undefined;
            };
            showWordLimit: boolean;
        }> & Omit<Readonly<{
            modelValue?: unknown;
            defaultValue?: unknown;
            size?: unknown;
            allowClear?: unknown;
            disabled?: unknown;
            readonly?: unknown;
            error?: unknown;
            placeholder?: unknown;
            maxLength?: unknown;
            showWordLimit?: unknown;
            wordLength?: unknown;
            wordSlice?: unknown;
            inputAttrs?: unknown;
            type?: unknown;
        } & {
            disabled: boolean;
            type: "text" | "password";
            readonly: boolean;
            error: boolean;
            allowClear: boolean;
            defaultValue: string;
            maxLength: number | {
                length: number;
                errorOnly?: boolean | undefined;
            };
            showWordLimit: boolean;
        } & {
            size?: "mini" | "medium" | "large" | "small" | undefined;
            placeholder?: string | undefined;
            modelValue?: string | undefined;
            wordLength?: ((value: string) => number) | undefined;
            wordSlice?: ((value: string, maxLength: number) => string) | undefined;
            inputAttrs?: Record<string, any> | undefined;
        }> & {
            onFocus?: ((ev: FocusEvent) => any) | undefined;
            onBlur?: ((ev: FocusEvent) => any) | undefined;
            onChange?: ((value: string, ev: Event) => any) | undefined;
            onInput?: ((value: string, ev: Event) => any) | undefined;
            onClear?: ((ev: MouseEvent) => any) | undefined;
            onPressEnter?: ((ev: KeyboardEvent) => any) | undefined;
            "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, "disabled" | "type" | "readonly" | "error" | "allowClear" | "defaultValue" | "maxLength" | "showWordLimit">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import("vue").Slot | undefined;
        }>;
        $root: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $parent: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $emit: ((event: "focus", ev: FocusEvent) => void) & ((event: "clear", ev: MouseEvent) => void) & ((event: "input", value: string, ev: Event) => void) & ((event: "change", value: string, ev: Event) => void) & ((event: "blur", ev: FocusEvent) => void) & ((event: "update:modelValue", value: string) => void) & ((event: "pressEnter", ev: KeyboardEvent) => void);
        $el: any;
        $options: import("vue").ComponentOptionsBase<Readonly<{
            modelValue?: unknown;
            defaultValue?: unknown;
            size?: unknown;
            allowClear?: unknown;
            disabled?: unknown;
            readonly?: unknown;
            error?: unknown;
            placeholder?: unknown;
            maxLength?: unknown;
            showWordLimit?: unknown;
            wordLength?: unknown;
            wordSlice?: unknown;
            inputAttrs?: unknown;
            type?: unknown;
        } & {
            disabled: boolean;
            type: "text" | "password";
            readonly: boolean;
            error: boolean;
            allowClear: boolean;
            defaultValue: string;
            maxLength: number | {
                length: number;
                errorOnly?: boolean | undefined;
            };
            showWordLimit: boolean;
        } & {
            size?: "mini" | "medium" | "large" | "small" | undefined;
            placeholder?: string | undefined;
            modelValue?: string | undefined;
            wordLength?: ((value: string) => number) | undefined;
            wordSlice?: ((value: string, maxLength: number) => string) | undefined;
            inputAttrs?: Record<string, any> | undefined;
        }> & {
            onFocus?: ((ev: FocusEvent) => any) | undefined;
            onBlur?: ((ev: FocusEvent) => any) | undefined;
            onChange?: ((value: string, ev: Event) => any) | undefined;
            onInput?: ((value: string, ev: Event) => any) | undefined;
            onClear?: ((ev: MouseEvent) => any) | undefined;
            onPressEnter?: ((ev: KeyboardEvent) => any) | undefined;
            "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        }, {
            inputRef: import("vue").Ref<HTMLInputElement | undefined>;
            render: () => JSX.Element;
        }, unknown, {}, {
            focus(): void;
            blur(): void;
        }, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            'update:modelValue': (value: string) => true;
            input: (value: string, ev: Event) => true;
            change: (value: string, ev: Event) => true;
            pressEnter: (ev: KeyboardEvent) => true;
            clear: (ev: MouseEvent) => true;
            focus: (ev: FocusEvent) => true;
            blur: (ev: FocusEvent) => true;
        }, string, {
            disabled: boolean;
            type: "text" | "password";
            readonly: boolean;
            error: boolean;
            allowClear: boolean;
            defaultValue: string;
            maxLength: number | {
                length: number;
                errorOnly?: boolean | undefined;
            };
            showWordLimit: boolean;
        }> & {
            beforeCreate?: ((() => void) | (() => void)[]) | undefined;
            created?: ((() => void) | (() => void)[]) | undefined;
            beforeMount?: ((() => void) | (() => void)[]) | undefined;
            mounted?: ((() => void) | (() => void)[]) | undefined;
            beforeUpdate?: ((() => void) | (() => void)[]) | undefined;
            updated?: ((() => void) | (() => void)[]) | undefined;
            activated?: ((() => void) | (() => void)[]) | undefined;
            deactivated?: ((() => void) | (() => void)[]) | undefined;
            beforeDestroy?: ((() => void) | (() => void)[]) | undefined;
            beforeUnmount?: ((() => void) | (() => void)[]) | undefined;
            destroyed?: ((() => void) | (() => void)[]) | undefined;
            unmounted?: ((() => void) | (() => void)[]) | undefined;
            renderTracked?: (((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[]) | undefined;
            renderTriggered?: (((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[]) | undefined;
            errorCaptured?: (((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void)[]) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof import("vue").nextTick;
        $watch(source: string | Function, cb: Function, options?: import("vue").WatchOptions<boolean> | undefined): import("vue").WatchStopHandle;
    } & Readonly<{
        modelValue?: unknown;
        defaultValue?: unknown;
        size?: unknown;
        allowClear?: unknown;
        disabled?: unknown;
        readonly?: unknown;
        error?: unknown;
        placeholder?: unknown;
        maxLength?: unknown;
        showWordLimit?: unknown;
        wordLength?: unknown;
        wordSlice?: unknown;
        inputAttrs?: unknown;
        type?: unknown;
    } & {
        disabled: boolean;
        type: "text" | "password";
        readonly: boolean;
        error: boolean;
        allowClear: boolean;
        defaultValue: string;
        maxLength: number | {
            length: number;
            errorOnly?: boolean | undefined;
        };
        showWordLimit: boolean;
    } & {
        size?: "mini" | "medium" | "large" | "small" | undefined;
        placeholder?: string | undefined;
        modelValue?: string | undefined;
        wordLength?: ((value: string) => number) | undefined;
        wordSlice?: ((value: string, maxLength: number) => string) | undefined;
        inputAttrs?: Record<string, any> | undefined;
    }> & {
        onFocus?: ((ev: FocusEvent) => any) | undefined;
        onBlur?: ((ev: FocusEvent) => any) | undefined;
        onChange?: ((value: string, ev: Event) => any) | undefined;
        onInput?: ((value: string, ev: Event) => any) | undefined;
        onClear?: ((ev: MouseEvent) => any) | undefined;
        onPressEnter?: ((ev: KeyboardEvent) => any) | undefined;
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    } & import("vue").ShallowUnwrapRef<{
        inputRef: import("vue").Ref<HTMLInputElement | undefined>;
        render: () => JSX.Element;
    }> & {} & {} & {
        focus(): void;
        blur(): void;
    } & import("vue").ComponentCustomProperties;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<{
    modelValue?: unknown;
    defaultValue?: unknown;
    size?: unknown;
    allowClear?: unknown;
    disabled?: unknown;
    readonly?: unknown;
    error?: unknown;
    placeholder?: unknown;
    maxLength?: unknown;
    showWordLimit?: unknown;
    wordLength?: unknown;
    wordSlice?: unknown;
    inputAttrs?: unknown;
    type?: unknown;
} & {
    disabled: boolean;
    type: "text" | "password";
    readonly: boolean;
    error: boolean;
    allowClear: boolean;
    defaultValue: string;
    maxLength: number | {
        length: number;
        errorOnly?: boolean | undefined;
    };
    showWordLimit: boolean;
} & {
    size?: "mini" | "medium" | "large" | "small" | undefined;
    placeholder?: string | undefined;
    modelValue?: string | undefined;
    wordLength?: ((value: string) => number) | undefined;
    wordSlice?: ((value: string, maxLength: number) => string) | undefined;
    inputAttrs?: Record<string, any> | undefined;
}> & {
    onFocus?: ((ev: FocusEvent) => any) | undefined;
    onBlur?: ((ev: FocusEvent) => any) | undefined;
    onChange?: ((value: string, ev: Event) => any) | undefined;
    onInput?: ((value: string, ev: Event) => any) | undefined;
    onClear?: ((ev: MouseEvent) => any) | undefined;
    onPressEnter?: ((ev: KeyboardEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}, {
    inputRef: import("vue").Ref<HTMLInputElement | undefined>;
    render: () => JSX.Element;
}, unknown, {}, {
    focus(): void;
    blur(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:modelValue': (value: string) => true;
    input: (value: string, ev: Event) => true;
    change: (value: string, ev: Event) => true;
    pressEnter: (ev: KeyboardEvent) => true;
    clear: (ev: MouseEvent) => true;
    focus: (ev: FocusEvent) => true;
    blur: (ev: FocusEvent) => true;
}, string, {
    disabled: boolean;
    type: "text" | "password";
    readonly: boolean;
    error: boolean;
    allowClear: boolean;
    defaultValue: string;
    maxLength: number | {
        length: number;
        errorOnly?: boolean | undefined;
    };
    showWordLimit: boolean;
}> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    Search: import("vue").DefineComponent<{
        searchButton: {
            type: BooleanConstructor;
            default: boolean;
        };
        loading: {
            type: BooleanConstructor;
            default: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        size: {
            type: import("vue").PropType<"mini" | "medium" | "large" | "small">;
        };
        buttonText: {
            type: StringConstructor;
        };
        buttonProps: {
            type: import("vue").PropType<import("..").ButtonProps>;
        };
    }, {
        inputRef: import("vue").Ref<any>;
        render: () => JSX.Element;
    }, unknown, {}, {
        focus(): void;
        blur(): void;
    }, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        search: (value: string, ev: MouseEvent) => true;
    }, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
        searchButton?: unknown;
        loading?: unknown;
        disabled?: unknown;
        size?: unknown;
        buttonText?: unknown;
        buttonProps?: unknown;
    } & {
        disabled: boolean;
        loading: boolean;
        searchButton: boolean;
    } & {
        size?: "mini" | "medium" | "large" | "small" | undefined;
        buttonText?: string | undefined;
        buttonProps?: import("..").ButtonProps | undefined;
    }> & {
        onSearch?: ((value: string, ev: MouseEvent) => any) | undefined;
    }, {
        disabled: boolean;
        loading: boolean;
        searchButton: boolean;
    }>;
    Password: import("vue").DefineComponent<{
        visibility: {
            type: BooleanConstructor;
            default: undefined;
        };
        defaultVisibility: {
            type: BooleanConstructor;
            default: boolean;
        };
        invisibleButton: {
            type: BooleanConstructor;
            default: boolean;
        };
    }, {
        inputRef: import("vue").Ref<any>;
        mergedVisible: import("vue").ComputedRef<boolean>;
        handleInvisible: () => void;
    }, unknown, {}, {
        focus(): void;
        blur(): void;
    }, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("visibility-change" | "update:visibility")[], "visibility-change" | "update:visibility", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
        visibility?: unknown;
        defaultVisibility?: unknown;
        invisibleButton?: unknown;
    } & {
        defaultVisibility: boolean;
        invisibleButton: boolean;
    } & {
        visibility?: boolean | undefined;
    }> & {
        "onVisibility-change"?: ((...args: any[]) => any) | undefined;
        "onUpdate:visibility"?: ((...args: any[]) => any) | undefined;
    }, {
        visibility: boolean;
        defaultVisibility: boolean;
        invisibleButton: boolean;
    }>;
    Group: import("vue").DefineComponent<{}, {
        prefixCls: string;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, import("vue").EmitsOptions, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{} & {} & {}>, {}>;
    install: (app: App, options?: ArcoOptions | undefined) => void;
};
export declare type InputInstance = InstanceType<typeof _Input>;
export declare type InputSearchInstance = InstanceType<typeof _InputSearch>;
export declare type InputPasswordInstance = InstanceType<typeof _InputPassword>;
export declare type InputGroupInstance = InstanceType<typeof _InputGroup>;
export { _InputSearch as InputSearch, _InputPassword as InputPassword, _InputGroup as InputGroup, };
export default Input;
