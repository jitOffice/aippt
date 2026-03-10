var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getViewBox } from '../utils/index.js';
import { exportToSVG } from './svg.js';
export function exportToPNGString(svg_1) {
    return __awaiter(this, arguments, void 0, function* (svg, options = {}) {
        var _a;
        const { dpr = (_a = globalThis.devicePixelRatio) !== null && _a !== void 0 ? _a : 2, removeBackground = false } = options;
        const node = yield exportToSVG(svg, { removeBackground });
        const { width, height } = getViewBox(node);
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                // 应用 DPR 缩放
                ctx.scale(dpr, dpr);
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                node.setAttribute('width', String(width));
                node.setAttribute('height', String(height));
                const updatedSvgData = new XMLSerializer().serializeToString(node);
                const svgURL = 'data:image/svg+xml;charset=utf-8,' +
                    encodeURIComponent(updatedSvgData);
                const img = new Image();
                img.onload = function () {
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    const pngURL = canvas.toDataURL('image/png');
                    resolve(pngURL);
                };
                img.onerror = function (error) {
                    reject(new Error('Image load failed: ' + error));
                };
                img.src = svgURL;
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
