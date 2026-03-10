"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImageBase64Resource = loadImageBase64Resource;
const utils_1 = require("../../utils");
function isImageBase64Resource(resource) {
    return resource.startsWith('data:');
}
function loadImageBase64Resource(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!data || !isImageBase64Resource(data))
            return null;
        const mimeType = (_a = data.match(/^data:([^;]+)/)) === null || _a === void 0 ? void 0 : _a[1];
        if (!mimeType)
            return null;
        const analysis = () => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const width = img.naturalWidth;
                    const height = img.naturalHeight;
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        return resolve({ width, height, hasAlpha: false });
                    }
                    // skip analysis for jpeg/jpg/webp/gif
                    if (['image/jpeg', 'image/jpg', 'image/webp', 'image/gif'].includes(mimeType)) {
                        return resolve({ width, height, hasAlpha: false });
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0);
                    let hasAlpha = false;
                    const step = 10;
                    for (let x = 0; x < width; x += step) {
                        if (hasAlpha)
                            break;
                        for (let y = 0; y < height; y += step) {
                            const imageData = ctx.getImageData(x, y, 1, 1);
                            if (imageData.data[3] < 255) {
                                hasAlpha = true;
                                break;
                            }
                        }
                    }
                    resolve({ width, height, hasAlpha });
                };
                img.onerror = () => reject(new Error('Failed to analysis image'));
                img.src = data;
            });
        };
        const { width, height, hasAlpha } = yield analysis();
        const getPreserveAspectRatio = () => {
            if (hasAlpha)
                return 'xMidYMid meet';
            if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('image/gif')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('image/svg'))) {
                return 'xMidYMid meet';
            }
            const minDimension = Math.min(width, height);
            if (minDimension <= 200)
                return 'xMidYMid meet';
            const aspectRatio = width / height;
            if (aspectRatio >= 0.6 && aspectRatio <= 1.67)
                return 'xMidYMid meet';
            if (aspectRatio < 0.3 || aspectRatio > 3.33)
                return 'xMidYMid meet';
            return 'xMidYMid slice';
        };
        const preserveAspectRatio = getPreserveAspectRatio();
        return (0, utils_1.parseSVG)(`
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="${preserveAspectRatio}">
  <image href="${data}" width="${width}" height="${height}" />
</symbol>`);
    });
}
