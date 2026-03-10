import { StrokeOptions } from "perfect-freehand";
import * as nanoevents0 from "nanoevents";

//#region src/types.d.ts
type DrawingMode = 'draw' | 'stylus' | 'line' | 'rectangle' | 'ellipse' | 'eraseLine';
interface Brush {
  /**
   * @default 'brush'
   */
  mode?: DrawingMode;
  /**
   * Stroke color
   */
  color: string;
  /**
   * Stroke width
   */
  size: number;
  /**
   * Color filled, only works in `rectangle` and `ellipse` mode.
   * @default 'transparent'
   */
  fill?: string;
  /**
   * Pattern of dashes, set to `undefined` for solid line.
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
   */
  dasharray?: string;
  /**
   * Corner radius of the rectangle.
   * Works only in `rectangle` mode.
   *
   * @default 0
   */
  cornerRadius?: number;
  /**
   * Show an arrow at the end of the line.
   * Works only in `draw` and `line` mode.
   *
   * @default false
   */
  arrowEnd?: boolean;
  /**
   * Options for 'perfect-freehand'
   */
  stylusOptions?: StrokeOptions;
}
interface Point {
  x: number;
  y: number;
  pressure?: number;
}
interface Options {
  el?: string | SVGSVGElement;
  brush?: Brush;
  /**
   * Filter out events based on input type
   *
   * @default ['mouse', 'touch', 'pen']
   */
  acceptsInputTypes?: ('mouse' | 'touch' | 'pen')[];
  /**
   * Use different element to listen on the events
   *
   * @default the `el` option
   */
  eventTarget?: string | Element;
  /**
   * Listen to a different window for mouse events.
   * Useful when you have an iframe or a popup.
   *
   * @default window
   */
  window?: Window;
  /**
   * When you apply a scale transform to the svg container,
   * set this property to let drauu aware of the currect coordinates.
   * @default 1
   */
  coordinateScale?: number;
  /**
   * Apply SVG CTM transform when calculating the coordinates.
   *
   * @advanced you don't commonly need this
   * @default true
   */
  coordinateTransform?: boolean;
  /**
   * To calculate the correct touch and mouse event positions for
   * elements using the zoom property on older Chrome versions(before 96)
   * @default 1
   */
  cssZoom?: number;
  /**
   * Sets the offset of the transformation when calculating coordinates.
   *
   * @default { x: 0, y: 0 }
   */
  offset?: {
    x: number;
    y: number;
  };
}
interface EventsMap {
  start: () => void;
  end: () => void;
  committed: (node: SVGElement | undefined) => void;
  canceled: () => void;
  changed: () => void;
  mounted: () => void;
  unmounted: () => void;
}
interface Operation {
  undo: () => void;
  redo: () => void;
}
declare global {
  interface Touch {
    /**
     * Non standard property, currently only supported in Safari on iOS/iPadOS and macOS.
     */
    touchType?: 'direct' | 'stylus';
  }
}
//#endregion
//#region src/models/base.d.ts
declare abstract class BaseModel<T extends SVGElement> {
  protected drauu: Drauu;
  event: PointerEvent;
  point: Point;
  start: Point;
  el: T | null;
  constructor(drauu: Drauu);
  onSelected(_el: SVGSVGElement | null): void;
  onUnselected(): void;
  onStart(_point: Point): SVGElement | undefined;
  onMove(_point: Point): boolean;
  onEnd(_point: Point): Operation | boolean | undefined;
  get brush(): Brush;
  get shiftPressed(): boolean;
  get altPressed(): boolean;
  get svgElement(): SVGSVGElement | null;
  getMousePosition(event: PointerEvent): Point;
  protected createElement<K extends keyof SVGElementTagNameMap>(name: K, overrides?: Partial<Brush>): SVGElementTagNameMap[K];
  protected attr(name: string, value: string | number): void;
  private _setEvent;
  /**
   * @internal
   */
  _eventDown(event: PointerEvent): SVGElement | undefined;
  /**
   * @internal
   */
  _eventMove(event: PointerEvent): boolean;
  /**
   * @internal
   */
  _eventUp(event: PointerEvent): boolean | Operation | undefined;
}
//#endregion
//#region src/models/draw.d.ts
declare class DrawModel extends BaseModel<SVGPathElement> {
  points: Point[];
  private count;
  private arrowId;
  onStart(point: Point): SVGPathElement;
  onMove(point: Point): boolean;
  onEnd(): boolean;
  static line(a: Point, b: Point): {
    length: number;
    angle: number;
  };
  static controlPoint(current: Point, previous: Point, next?: Point, reverse?: boolean): {
    x: number;
    y: number;
  };
  static bezierCommand(point: Point, i: number, points: Point[]): string;
  static toSvgData(points: Point[]): string;
}
//#endregion
//#region src/models/ellipse.d.ts
declare class EllipseModel extends BaseModel<SVGEllipseElement> {
  onStart(point: Point): SVGEllipseElement;
  onMove(point: Point): boolean;
  onEnd(): boolean;
}
//#endregion
//#region src/models/eraser.d.ts
interface EraserPathFragment {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  segment: number;
  element: any;
}
declare class EraserModel extends BaseModel<SVGRectElement> {
  svgPointPrevious?: DOMPoint;
  svgPointCurrent?: DOMPoint;
  pathSubFactor: number;
  pathFragments: EraserPathFragment[];
  private _erased;
  onSelected(el: SVGSVGElement | null): void;
  onUnselected(): void;
  onStart(point: Point): undefined;
  onMove(point: Point): boolean;
  onEnd(): Operation;
  private checkAndEraseElement;
  private lineLineIntersect;
}
//#endregion
//#region src/models/line.d.ts
declare class LineModel extends BaseModel<SVGLineElement> {
  onStart(point: Point): SVGGElement;
  onMove(point: Point): boolean;
  onEnd(): boolean;
}
//#endregion
//#region src/models/rect.d.ts
declare class RectModel extends BaseModel<SVGRectElement> {
  onStart(point: Point): SVGRectElement;
  onMove(point: Point): boolean;
  onEnd(): boolean;
}
//#endregion
//#region src/models/stylus.d.ts
declare class StylusModel extends BaseModel<SVGPathElement> {
  points: Point[];
  onStart(point: Point): SVGPathElement;
  onMove(point: Point): boolean;
  onEnd(): boolean;
  getSvgData(points: Point[]): string;
  static getSvgData(points: Point[], brush: Brush): string;
}
//#endregion
//#region src/drauu.d.ts
declare class Drauu {
  options: Options;
  el: SVGSVGElement | null;
  svgPoint: DOMPoint | null;
  eventEl: Element | null;
  shiftPressed: boolean;
  altPressed: boolean;
  drawing: boolean;
  private _emitter;
  private _originalPointerId;
  private _models;
  private _currentNode;
  private _opStack;
  private _opIndex;
  private _disposables;
  private _elements;
  constructor(options?: Options);
  get model(): DrawModel | StylusModel | LineModel | RectModel | EllipseModel | EraserModel;
  get mounted(): boolean;
  get mode(): DrawingMode;
  set mode(v: DrawingMode);
  get brush(): Brush;
  set brush(v: Brush);
  resolveSelector<T>(selector: string | T | null | undefined): T | null;
  mount(el: string | SVGSVGElement, eventEl?: string | Element, listenWindow?: Window): void;
  unmount(): void;
  on<K extends keyof EventsMap>(type: K, fn: EventsMap[K]): nanoevents0.Unsubscribe;
  undo(): boolean;
  redo(): boolean;
  canRedo(): boolean;
  canUndo(): boolean;
  private eventMove;
  private eventStart;
  private eventEnd;
  private touchMove;
  private acceptsInput;
  private eventKeyboard;
  private commit;
  clear(): void;
  cancel(): void;
  dump(): string;
  load(svg: string): void;
  /**
   * @internal
   */
  _appendNode(node: SVGElement): void;
  /**
   * @internal
   */
  _removeNode(node: SVGElement): void;
  /**
   * @internal
   */
  _restoreNode(node: SVGElement): void;
}
declare function createDrauu(options?: Options): Drauu;
//#endregion
export { Brush, Drauu, DrawModel, DrawingMode, EllipseModel, EraserModel, EventsMap, LineModel, Operation, Options, Point, RectModel, StylusModel, createDrauu };