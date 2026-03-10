import { computed, isReadonly, ref, toValue } from "vue";
import { clamp, reactify } from "@vueuse/shared";

//#region createGenericProjection/index.ts
/* @__NO_SIDE_EFFECTS__ */
function createGenericProjection(fromDomain, toDomain, projector) {
	return (input) => {
		return computed(() => projector(toValue(input), toValue(fromDomain), toValue(toDomain)));
	};
}

//#endregion
//#region createProjection/index.ts
function defaultNumericProjector(input, from, to) {
	return (input - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0];
}
/* @__NO_SIDE_EFFECTS__ */
function createProjection(fromDomain, toDomain, projector = defaultNumericProjector) {
	return /* @__PURE__ */ createGenericProjection(fromDomain, toDomain, projector);
}

//#endregion
//#region logicAnd/index.ts
/**
* `AND` conditions for refs.
*
* @see https://vueuse.org/logicAnd
*
* @__NO_SIDE_EFFECTS__
*/
function logicAnd(...args) {
	return computed(() => args.every((i) => toValue(i)));
}
/** @deprecated use `logicAnd` instead */
const and = logicAnd;

//#endregion
//#region logicNot/index.ts
/**
* `NOT` conditions for refs.
*
* @see https://vueuse.org/logicNot
*
* @__NO_SIDE_EFFECTS__
*/
function logicNot(v) {
	return computed(() => !toValue(v));
}
/** @deprecated use `logicNot` instead */
const not = logicNot;

//#endregion
//#region logicOr/index.ts
/**
* `OR` conditions for refs.
*
* @see https://vueuse.org/logicOr
*
* @__NO_SIDE_EFFECTS__
*/
function logicOr(...args) {
	return computed(() => args.some((i) => toValue(i)));
}
/** @deprecated use `logicOr` instead */
const or = logicOr;

//#endregion
//#region useAbs/index.ts
/**
* Reactive `Math.abs`.
*
* @see https://vueuse.org/useAbs
*
* @__NO_SIDE_EFFECTS__
*/
function useAbs(value) {
	return computed(() => Math.abs(toValue(value)));
}

//#endregion
//#region utils.ts
function toValueArgsFlat(args) {
	return args.flatMap((i) => {
		const v = toValue(i);
		if (Array.isArray(v)) return v.map((i$1) => toValue(i$1));
		return [v];
	});
}

//#endregion
//#region useAverage/index.ts
/**
* Get the average of an array reactively
*
* @see https://vueuse.org/useAverage
*
* @__NO_SIDE_EFFECTS__
*/
function useAverage(...args) {
	return computed(() => {
		const array = toValueArgsFlat(args);
		return array.reduce((sum, v) => sum += v, 0) / array.length;
	});
}

//#endregion
//#region useCeil/index.ts
/**
* Reactive `Math.ceil`.
*
* @see https://vueuse.org/useCeil
*
* @__NO_SIDE_EFFECTS__
*/
function useCeil(value) {
	return computed(() => Math.ceil(toValue(value)));
}

//#endregion
//#region useClamp/index.ts
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
function useClamp(value, min, max) {
	if (typeof value === "function" || isReadonly(value)) return computed(() => clamp(toValue(value), toValue(min), toValue(max)));
	const _value = ref(value);
	return computed({
		get() {
			return _value.value = clamp(_value.value, toValue(min), toValue(max));
		},
		set(value$1) {
			_value.value = clamp(value$1, toValue(min), toValue(max));
		}
	});
}

//#endregion
//#region useFloor/index.ts
/**
* Reactive `Math.floor`
*
* @see https://vueuse.org/useFloor
*
* @__NO_SIDE_EFFECTS__
*/
function useFloor(value) {
	return computed(() => Math.floor(toValue(value)));
}

//#endregion
//#region useMath/index.ts
/**
* Reactive `Math` methods.
*
* @see https://vueuse.org/useMath
*
* @__NO_SIDE_EFFECTS__
*/
function useMath(key, ...args) {
	return reactify(Math[key])(...args);
}

//#endregion
//#region useMax/index.ts
/**
* Reactively get maximum of values.
*
* @see https://vueuse.org/useMax
*
* @__NO_SIDE_EFFECTS__
*/
function useMax(...args) {
	return computed(() => {
		const array = toValueArgsFlat(args);
		return Math.max(...array);
	});
}

//#endregion
//#region useMin/index.ts
/**
* Reactive `Math.min`.
*
* @see https://vueuse.org/useMin
*
* @__NO_SIDE_EFFECTS__
*/
function useMin(...args) {
	return computed(() => {
		const array = toValueArgsFlat(args);
		return Math.min(...array);
	});
}

//#endregion
//#region usePrecision/index.ts
/**
* Accuracy of handling numerical values.
*
* @param value - The value
* @param power - The power
* @returns The result of multiplying the value with the power
*/
function accurateMultiply(value, power) {
	const valueStr = value.toString();
	if (value > 0 && valueStr.includes(".")) {
		const multiplier = 10 ** valueStr.split(".")[1].length;
		return value * multiplier * power / multiplier;
	} else return value * power;
}
/**
* Reactively set the precision of a number.
*
* @see https://vueuse.org/usePrecision
*
* @__NO_SIDE_EFFECTS__
*/
function usePrecision(value, digits, options) {
	return computed(() => {
		var _toValue;
		const _value = toValue(value);
		const power = 10 ** toValue(digits);
		return Math[((_toValue = toValue(options)) === null || _toValue === void 0 ? void 0 : _toValue.math) || "round"](accurateMultiply(_value, power)) / power;
	});
}

//#endregion
//#region useProjection/index.ts
/**
* Reactive numeric projection from one domain to another.
*
* @see https://vueuse.org/useProjection
*
* @__NO_SIDE_EFFECTS__
*/
function useProjection(input, fromDomain, toDomain, projector) {
	return (/* @__PURE__ */ createProjection(fromDomain, toDomain, projector))(input);
}

//#endregion
//#region useRound/index.ts
/**
* Reactive `Math.round`.
*
* @see https://vueuse.org/useRound
*
* @__NO_SIDE_EFFECTS__
*/
function useRound(value) {
	return computed(() => Math.round(toValue(value)));
}

//#endregion
//#region useSum/index.ts
/**
* Get the sum of a set of numbers.
*
* @see https://vueuse.org/useSum
*
* @__NO_SIDE_EFFECTS__
*/
function useSum(...args) {
	return computed(() => toValueArgsFlat(args).reduce((sum, v) => sum += v, 0));
}

//#endregion
//#region useTrunc/index.ts
/**
* Reactive `Math.trunc`.
*
* @see https://vueuse.org/useTrunc
*
* @__NO_SIDE_EFFECTS__
*/
function useTrunc(value) {
	return computed(() => Math.trunc(toValue(value)));
}

//#endregion
export { and, createGenericProjection, createProjection, logicAnd, logicNot, logicOr, not, or, useAbs, useAverage, useCeil, useClamp, useFloor, useMath, useMax, useMin, usePrecision, useProjection, useRound, useSum, useTrunc };