(function(exports, vue, __vueuse_shared) {

//#region rolldown:runtime
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));

//#endregion
vue = __toESM(vue);
__vueuse_shared = __toESM(__vueuse_shared);

//#region createGenericProjection/index.ts
	/* @__NO_SIDE_EFFECTS__ */
	function createGenericProjection(fromDomain, toDomain, projector) {
		return (input) => {
			return (0, vue.computed)(() => projector((0, vue.toValue)(input), (0, vue.toValue)(fromDomain), (0, vue.toValue)(toDomain)));
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
		return (0, vue.computed)(() => args.every((i) => (0, vue.toValue)(i)));
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
		return (0, vue.computed)(() => !(0, vue.toValue)(v));
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
		return (0, vue.computed)(() => args.some((i) => (0, vue.toValue)(i)));
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
		return (0, vue.computed)(() => Math.abs((0, vue.toValue)(value)));
	}

//#endregion
//#region utils.ts
	function toValueArgsFlat(args) {
		return args.flatMap((i) => {
			const v = (0, vue.toValue)(i);
			if (Array.isArray(v)) return v.map((i$1) => (0, vue.toValue)(i$1));
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
		return (0, vue.computed)(() => {
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
		return (0, vue.computed)(() => Math.ceil((0, vue.toValue)(value)));
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
		if (typeof value === "function" || (0, vue.isReadonly)(value)) return (0, vue.computed)(() => (0, __vueuse_shared.clamp)((0, vue.toValue)(value), (0, vue.toValue)(min), (0, vue.toValue)(max)));
		const _value = (0, vue.ref)(value);
		return (0, vue.computed)({
			get() {
				return _value.value = (0, __vueuse_shared.clamp)(_value.value, (0, vue.toValue)(min), (0, vue.toValue)(max));
			},
			set(value$1) {
				_value.value = (0, __vueuse_shared.clamp)(value$1, (0, vue.toValue)(min), (0, vue.toValue)(max));
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
		return (0, vue.computed)(() => Math.floor((0, vue.toValue)(value)));
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
		return (0, __vueuse_shared.reactify)(Math[key])(...args);
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
		return (0, vue.computed)(() => {
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
		return (0, vue.computed)(() => {
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
		return (0, vue.computed)(() => {
			var _toValue;
			const _value = (0, vue.toValue)(value);
			const power = 10 ** (0, vue.toValue)(digits);
			return Math[((_toValue = (0, vue.toValue)(options)) === null || _toValue === void 0 ? void 0 : _toValue.math) || "round"](accurateMultiply(_value, power)) / power;
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
		return (0, vue.computed)(() => Math.round((0, vue.toValue)(value)));
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
		return (0, vue.computed)(() => toValueArgsFlat(args).reduce((sum, v) => sum += v, 0));
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
		return (0, vue.computed)(() => Math.trunc((0, vue.toValue)(value)));
	}

//#endregion
exports.and = and;
exports.createGenericProjection = createGenericProjection;
exports.createProjection = createProjection;
exports.logicAnd = logicAnd;
exports.logicNot = logicNot;
exports.logicOr = logicOr;
exports.not = not;
exports.or = or;
exports.useAbs = useAbs;
exports.useAverage = useAverage;
exports.useCeil = useCeil;
exports.useClamp = useClamp;
exports.useFloor = useFloor;
exports.useMath = useMath;
exports.useMax = useMax;
exports.useMin = useMin;
exports.usePrecision = usePrecision;
exports.useProjection = useProjection;
exports.useRound = useRound;
exports.useSum = useSum;
exports.useTrunc = useTrunc;
})(this.VueUse = this.VueUse || {}, Vue, VueUse);