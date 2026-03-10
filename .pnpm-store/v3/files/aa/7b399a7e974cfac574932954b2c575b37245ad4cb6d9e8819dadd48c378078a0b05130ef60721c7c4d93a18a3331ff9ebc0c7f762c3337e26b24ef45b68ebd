import * as vue0 from "vue";
import { ComputedRef, MaybeRefOrGetter, Ref } from "vue";
import { ArgumentsType, Reactified, ReadonlyRefOrGetter } from "@vueuse/shared";

//#region createGenericProjection/index.d.ts
type ProjectorFunction<F, T> = (input: F, from: readonly [F, F], to: readonly [T, T]) => T;
type UseProjection<F, T> = (input: MaybeRefOrGetter<F>) => ComputedRef<T>;
declare function createGenericProjection<F = number, T = number>(fromDomain: MaybeRefOrGetter<readonly [F, F]>, toDomain: MaybeRefOrGetter<readonly [T, T]>, projector: ProjectorFunction<F, T>): UseProjection<F, T>;
//#endregion
//#region createProjection/index.d.ts
declare function createProjection(fromDomain: MaybeRefOrGetter<readonly [number, number]>, toDomain: MaybeRefOrGetter<readonly [number, number]>, projector?: ProjectorFunction<number, number>): UseProjection<number, number>;
//#endregion
//#region logicAnd/index.d.ts
/**
 * `AND` conditions for refs.
 *
 * @see https://vueuse.org/logicAnd
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function logicAnd(...args: MaybeRefOrGetter<any>[]): ComputedRef<boolean>;
/** @deprecated use `logicAnd` instead */
declare const and: typeof logicAnd;
//#endregion
//#region logicNot/index.d.ts
/**
 * `NOT` conditions for refs.
 *
 * @see https://vueuse.org/logicNot
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function logicNot(v: MaybeRefOrGetter<any>): ComputedRef<boolean>;
/** @deprecated use `logicNot` instead */
declare const not: typeof logicNot;
//#endregion
//#region logicOr/index.d.ts
/**
 * `OR` conditions for refs.
 *
 * @see https://vueuse.org/logicOr
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function logicOr(...args: MaybeRefOrGetter<any>[]): ComputedRef<boolean>;
/** @deprecated use `logicOr` instead */
declare const or: typeof logicOr;
//#endregion
//#region useAbs/index.d.ts
/**
 * Reactive `Math.abs`.
 *
 * @see https://vueuse.org/useAbs
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useAbs(value: MaybeRefOrGetter<number>): ComputedRef<number>;
//#endregion
//#region useAverage/index.d.ts
declare function useAverage(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>;
declare function useAverage(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>;
//#endregion
//#region useCeil/index.d.ts
/**
 * Reactive `Math.ceil`.
 *
 * @see https://vueuse.org/useCeil
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useCeil(value: MaybeRefOrGetter<number>): ComputedRef<number>;
//#endregion
//#region useClamp/index.d.ts
/**
 * Reactively clamp a value between two other values.
 *
 * @see https://vueuse.org/useClamp
 * @param value number
 * @param min
 * @param max
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useClamp(value: ReadonlyRefOrGetter<number>, min: MaybeRefOrGetter<number>, max: MaybeRefOrGetter<number>): ComputedRef<number>;
declare function useClamp(value: MaybeRefOrGetter<number>, min: MaybeRefOrGetter<number>, max: MaybeRefOrGetter<number>): Ref<number>;
//#endregion
//#region useFloor/index.d.ts
/**
 * Reactive `Math.floor`
 *
 * @see https://vueuse.org/useFloor
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useFloor(value: MaybeRefOrGetter<number>): ComputedRef<number>;
//#endregion
//#region useMath/index.d.ts
type UseMathKeys = keyof { [K in keyof Math as Math[K] extends ((...args: any) => any) ? K : never]: unknown };
type UseMathReturn<K$1 extends keyof Math> = ReturnType<Reactified<Math[K$1], true>>;
/**
 * Reactive `Math` methods.
 *
 * @see https://vueuse.org/useMath
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useMath<K$1 extends keyof Math>(key: K$1, ...args: ArgumentsType<Reactified<Math[K$1], true>>): UseMathReturn<K$1>;
//#endregion
//#region useMax/index.d.ts
declare function useMax(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>;
declare function useMax(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>;
//#endregion
//#region useMin/index.d.ts
declare function useMin(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>;
declare function useMin(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>;
//#endregion
//#region usePrecision/index.d.ts
interface UsePrecisionOptions {
  /**
   * Method to use for rounding
   *
   * @default 'round'
   */
  math?: 'floor' | 'ceil' | 'round';
}
/**
 * Reactively set the precision of a number.
 *
 * @see https://vueuse.org/usePrecision
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function usePrecision(value: MaybeRefOrGetter<number>, digits: MaybeRefOrGetter<number>, options?: MaybeRefOrGetter<UsePrecisionOptions>): ComputedRef<number>;
//#endregion
//#region useProjection/index.d.ts
/**
 * Reactive numeric projection from one domain to another.
 *
 * @see https://vueuse.org/useProjection
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useProjection(input: MaybeRefOrGetter<number>, fromDomain: MaybeRefOrGetter<readonly [number, number]>, toDomain: MaybeRefOrGetter<readonly [number, number]>, projector?: ProjectorFunction<number, number>): vue0.ComputedRef<number>;
//#endregion
//#region useRound/index.d.ts
/**
 * Reactive `Math.round`.
 *
 * @see https://vueuse.org/useRound
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useRound(value: MaybeRefOrGetter<number>): ComputedRef<number>;
//#endregion
//#region useSum/index.d.ts
declare function useSum(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>;
declare function useSum(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>;
//#endregion
//#region useTrunc/index.d.ts
/**
 * Reactive `Math.trunc`.
 *
 * @see https://vueuse.org/useTrunc
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useTrunc(value: MaybeRefOrGetter<number>): ComputedRef<number>;
//#endregion
export { ProjectorFunction, UseMathKeys, UseMathReturn, UsePrecisionOptions, UseProjection, and, createGenericProjection, createProjection, logicAnd, logicNot, logicOr, not, or, useAbs, useAverage, useCeil, useClamp, useFloor, useMath, useMax, useMin, usePrecision, useProjection, useRound, useSum, useTrunc };