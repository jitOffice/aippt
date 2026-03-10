"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spectral = exports.antv = void 0;
const registry_1 = require("./registry");
exports.antv = [
    '#1783FF',
    '#00C9C9',
    '#F0884D',
    '#D580FF',
    '#7863FF',
    '#60C42D',
    '#BD8F24',
    '#FF80CA',
    '#2491B3',
    '#17C76F',
    '#70CAF8',
];
(0, registry_1.registerPalette)('antv', exports.antv);
const spectral = (_, index, count) => {
    const colors = [
        ['#fc8d59', '#ffffbf', '#99d594'],
        ['#d7191c', '#fdae61', '#abdda4', '#2b83ba'],
        ['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'],
        ['#d53e4f', '#fc8d59', '#fee08b', '#e6f598', '#99d594', '#3288bd'],
        [
            '#d53e4f',
            '#fc8d59',
            '#fee08b',
            '#ffffbf',
            '#e6f598',
            '#99d594',
            '#3288bd',
        ],
        [
            '#d53e4f',
            '#f46d43',
            '#fdae61',
            '#fee08b',
            '#e6f598',
            '#abdda4',
            '#66c2a5',
            '#3288bd',
        ],
        [
            '#d53e4f',
            '#f46d43',
            '#fdae61',
            '#fee08b',
            '#ffffbf',
            '#e6f598',
            '#abdda4',
            '#66c2a5',
            '#3288bd',
        ],
        [
            '#9e0142',
            '#d53e4f',
            '#f46d43',
            '#fdae61',
            '#fee08b',
            '#e6f598',
            '#abdda4',
            '#66c2a5',
            '#3288bd',
            '#5e4fa2',
        ],
        [
            '#9e0142',
            '#d53e4f',
            '#f46d43',
            '#fdae61',
            '#fee08b',
            '#ffffbf',
            '#e6f598',
            '#abdda4',
            '#66c2a5',
            '#3288bd',
            '#5e4fa2',
        ],
    ];
    const size = Math.min(Math.max(count, 3), 11);
    return colors[size - 3][index % size];
};
exports.spectral = spectral;
(0, registry_1.registerPalette)('spectral', exports.spectral);
