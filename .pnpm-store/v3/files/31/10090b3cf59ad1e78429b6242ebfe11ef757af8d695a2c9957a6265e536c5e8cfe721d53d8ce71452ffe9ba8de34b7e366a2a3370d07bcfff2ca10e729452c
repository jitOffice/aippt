export interface TextStyle {
    /**
     * 字号
     * string 值将被通过 parseFloat 转换为数字，单位默认为像素
     */
    fontSize?: number | string;
    /** 字体 */
    fontFamily?: string;
    /**
     * 字重
     * - thin/hairline 100
     * - extra-light/ultra-light 200
     * - light/lighter 300
     * - regular/normal 400 (**default**)
     * - medium 500
     * - semi-bold/semibold/demi-bold/demibold 600
     * - extra-bold/extrabold/ultra-bold/ultrabold 800
     * - black/bolder/heavy 900
     * - extra-black/extrablack 950
     * - ultra-black/ultrablack 950
     */
    fontWeight?: string | number;
    /**
     * 字体样式
     * - normal (**default**)
     * - italic
     * - oblique
     */
    fontStyle?: string;
    /**
     * 文本转换
     * - none (**default**)
     * - capitalize
     * - uppercase
     * - lowercase
     */
    textTransform?: string;
    /** 字间距 (px) - 额外增加到每个字符的 advance 之后 */
    letterSpacing?: number;
    /** 词间距 (px) - 额外增加到空格字符的 advance 之后 */
    wordSpacing?: number;
    /**
     * 行高
     * - number: 倍数 (如 1.5 倍字号)
     * - PixelValue: 固定像素值
     * - PercentValue: 基于字号的百分比
     */
    lineHeight?: number | PercentValue | PixelValue;
}
export interface TextMetrics {
    /** 文本宽度 */
    width: number;
    /** 文本高度（即行高） */
    height: number;
    /** 基线 */
    baseline: number;
}
export interface FontData {
    fontFamily: string;
    /** 字体别名（可选） */
    aliases?: string[];
    /** 字重 */
    fontWeight: string | number;
    /** 字体样式 */
    fontStyle?: 'normal' | 'italic' | 'oblique';
    /** 归一化基准，如 1000 或 2048 */
    unitsPerEm: number;
    /** 全局垂直度量 */
    metrics: {
        /** 基线以上高度 */
        ascender: number;
        /** 基线以下深度 */
        descender: number;
        /** 行间距 */
        lineGap?: number;
    };
    /** 字形表 */
    glyphs?: {
        /** 直接存 xadv 数值 */
        [char: string]: number;
    };
    /** 如果字符在 glyphs 中找不到，且不满足特殊规则时，使用此宽度 */
    defaultWidth?: number;
    /** 按宽度分组的字符串，用于压缩存储（运行时会转换为 glyphs） */
    glyphsByWidth?: {
        [width: number]: string;
    };
    /** 可选：字距调整 */
    kerning?: {
        [pair: string]: number;
    };
}
type PercentValue = {
    type: 'percent';
    value: number;
};
type PixelValue = {
    type: 'pixel';
    value: number;
};
export {};
