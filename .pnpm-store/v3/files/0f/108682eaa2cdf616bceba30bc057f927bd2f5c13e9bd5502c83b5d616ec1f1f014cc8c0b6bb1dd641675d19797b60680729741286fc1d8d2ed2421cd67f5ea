"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSVGAttr = toSVGAttr;
const SPECIFIC_ATTRS_MAP = {
    className: 'class',
    // svg
    viewBox: 'viewBox',
    preserveAspectRatio: 'preserveAspectRatio',
    // Gradient
    gradientUnits: 'gradientUnits',
    gradientTransform: 'gradientTransform',
    // Pattern
    patternUnits: 'patternUnits',
    patternContentUnits: 'patternContentUnits',
    patternTransform: 'patternTransform',
    // Mask / Clip
    maskUnits: 'maskUnits',
    maskContentUnits: 'maskContentUnits',
    clipPathUnits: 'clipPathUnits',
    // Filter
    primitiveUnits: 'primitiveUnits',
    filterUnits: 'filterUnits',
    // Marker
    markerUnits: 'markerUnits',
    markerWidth: 'markerWidth',
    markerHeight: 'markerHeight',
    refX: 'refX',
    refY: 'refY',
    // XML
    xmlLang: 'xml:lang',
    xmlSpace: 'xml:space',
    xmlnsXlink: 'xmlns:xlink',
    // XLink
    xlinkHref: 'href',
    xlinkTitle: 'xlink:title',
    xlinkShow: 'xlink:show',
    xlinkActuate: 'xlink:actuate',
    // Text
    textLength: 'textLength',
    lengthAdjust: 'lengthAdjust',
    // Animation
    attributeName: 'attributeName',
    attributeType: 'attributeType',
    repeatCount: 'repeatCount',
    repeatDur: 'repeatDur',
    calcMode: 'calcMode',
    keyTimes: 'keyTimes',
    keySplines: 'keySplines',
    keyPoints: 'keyPoints',
    // filter
    stdDeviation: 'stdDeviation',
    baseFrequency: 'baseFrequency',
    numOctaves: 'numOctaves',
    // path
    pathLength: 'pathLength',
    // others
    systemLanguage: 'systemLanguage',
    requiredFeatures: 'requiredFeatures',
    requiredExtensions: 'requiredExtensions',
};
function toSVGAttr(name) {
    if (SPECIFIC_ATTRS_MAP[name]) {
        return SPECIFIC_ATTRS_MAP[name];
    }
    return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
