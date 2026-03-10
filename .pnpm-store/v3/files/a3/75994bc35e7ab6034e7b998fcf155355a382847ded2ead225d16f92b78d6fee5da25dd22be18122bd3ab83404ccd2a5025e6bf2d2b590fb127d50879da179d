import FloatingVue, { recomputeAllPoppers } from "floating-vue";

//#region src/client.ts
const isMobile = typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
/**
* Vue plugin to install FloatingVue with styles.
*
* Import this function in `.vitepress/theme/index.ts` and use `app.use(TwoslashFloatingVue)` inside the `enhanceApp` hook.
*/
const TwoslashFloatingVue = { install: (app, options = {}) => {
	if (typeof window !== "undefined") {
		window.addEventListener("vitepress:codeGroupTabActivate", recomputeAllPoppers, { passive: true });
		window.addEventListener("click", (e) => {
			if (e.composedPath().some((el) => el?.classList?.contains?.("vp-code-group") || el?.classList?.contains?.("tabs"))) recomputeAllPoppers();
		}, { passive: true });
		if (!isMobile) {
			let isDragging = false;
			window.addEventListener("mousedown", () => {
				isDragging = true;
			}, { passive: true });
			window.addEventListener("mouseup", () => {
				isDragging = false;
			}, { passive: true });
			const _component = app.component;
			app.component = function(...rest) {
				const comp = _component.apply(this, rest);
				if (rest.length >= 2 && rest[0] === "VMenu") try {
					const PopperTs = rest[1].components.Popper.extends;
					const _show = PopperTs.methods.show;
					PopperTs.methods.show = function(...args) {
						if (!isDragging) return _show.apply(this, args);
					};
					const _hide = PopperTs.methods.hide;
					PopperTs.methods.hide = function(...args) {
						if (!isDragging) return _hide.apply(this, args);
					};
				} catch (e) {
					console.error("Failed to patch FloatingVue", e);
				}
				return comp;
			};
		}
	}
	app.use(FloatingVue, {
		...options,
		themes: {
			...options.themes,
			"twoslash": {
				$extend: "dropdown",
				triggers: isMobile ? ["touch"] : ["hover", "touch"],
				popperTriggers: isMobile ? ["touch"] : ["hover", "touch"],
				placement: "bottom-start",
				overflowPadding: 10,
				delay: 0,
				handleResize: false,
				autoHide: true,
				noAutoFocus: true,
				instantMove: true,
				flip: false,
				arrowPadding: 8,
				autoBoundaryMaxSize: true,
				...options.themes?.twoslash ?? {}
			},
			"twoslash-query": {
				$extend: "twoslash",
				triggers: ["click"],
				popperTriggers: ["click"],
				autoHide: false,
				noAutoFocus: true,
				...options.themes?.["twoslash-query"] ?? {}
			},
			"twoslash-completion": {
				$extend: "twoslash-query",
				triggers: ["click"],
				popperTriggers: ["click"],
				autoHide: false,
				noAutoFocus: true,
				distance: 0,
				arrowOverflow: true,
				...options.themes?.["twoslash-completion"] ?? {}
			}
		}
	});
} };

//#endregion
export { TwoslashFloatingVue as default };