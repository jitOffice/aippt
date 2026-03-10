import { inRange } from 'lodash-es';
import { calculateZoomedViewBox, getViewBox, viewBoxToString, } from '../../utils/viewbox.js';
import { UpdateOptionsCommand } from '../commands/index.js';
import { clientToViewport } from '../utils/index.js';
import { Interaction } from './base.js';
const ZOOM_FACTOR = 1.1;
export class ZoomWheel extends Interaction {
    constructor(options) {
        super();
        this.name = 'zoom-wheel';
        this.minViewBoxSize = 20;
        this.maxViewBoxSize = 20000;
        this.initialViewBox = null;
        this.handleKeyUp = (event) => {
            const isZoomModifierHeld = event.ctrlKey || event.metaKey || event.shiftKey;
            if (!isZoomModifierHeld && this.initialViewBox) {
                const currentViewBox = viewBoxToString(getViewBox(this.editor.getDocument()));
                if (currentViewBox !== this.initialViewBox) {
                    const command = new UpdateOptionsCommand({ viewBox: currentViewBox }, { viewBox: this.initialViewBox });
                    void this.commander.execute(command);
                }
                this.initialViewBox = null;
                document.removeEventListener('keyup', this.handleKeyUp);
            }
        };
        this.wheelListener = (event) => {
            if (!this.shouldZoom(event))
                return;
            event.preventDefault();
            // Standard Zoom: Scroll Up (deltaY < 0) = Zoom In
            const isZoomIn = event.deltaY < 0;
            const factor = isZoomIn ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
            const svg = this.editor.getDocument();
            const viewBox = getViewBox(svg);
            const { width, height } = viewBox;
            const newWidth = width * factor;
            const newHeight = height * factor;
            if (!inRange(newWidth, this.minViewBoxSize, this.maxViewBoxSize) ||
                !inRange(newHeight, this.minViewBoxSize, this.maxViewBoxSize))
                return;
            if (this.initialViewBox === null) {
                this.initialViewBox = viewBoxToString(viewBox);
                document.addEventListener('keyup', this.handleKeyUp);
            }
            const pivot = (event.ctrlKey || event.metaKey) && !event.shiftKey
                ? this.getMousePoint(svg, event)
                : this.getCenterPoint(viewBox);
            const newViewBox = calculateZoomedViewBox(viewBox, factor, pivot);
            this.state.updateOptions({
                viewBox: viewBoxToString(newViewBox),
            });
        };
        this.getMousePoint = (svg, event) => {
            return clientToViewport(svg, event.clientX, event.clientY);
        };
        this.getCenterPoint = (viewBox) => {
            const centerX = viewBox.x + viewBox.width / 2;
            const centerY = viewBox.y + viewBox.height / 2;
            return { x: centerX, y: centerY };
        };
        this.shouldZoom = (event) => {
            if (!this.interaction.isActive())
                return false;
            if (event.deltaY === 0)
                return false;
            const isMouseZoom = event.ctrlKey || event.metaKey;
            const isCenterZoom = event.shiftKey;
            if (isMouseZoom && isCenterZoom)
                return false;
            return isMouseZoom || isCenterZoom;
        };
        if ((options === null || options === void 0 ? void 0 : options.minViewBoxSize) !== undefined) {
            this.minViewBoxSize = options.minViewBoxSize;
        }
        if ((options === null || options === void 0 ? void 0 : options.maxViewBoxSize) !== undefined) {
            this.maxViewBoxSize = options.maxViewBoxSize;
        }
    }
    init(options) {
        super.init(options);
        document.addEventListener('wheel', this.wheelListener, { passive: false });
    }
    destroy() {
        document.removeEventListener('wheel', this.wheelListener);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}
