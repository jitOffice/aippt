import type { Font } from '../../types';
export declare let DEFAULT_FONT: string;
export declare function getFont(font: string): Font | null;
export declare function getFonts(): Font[];
export declare function setDefaultFont(font: string): void;
/**
 * 注册自定义字体
 * @param font - 字体配置
 * @returns 注册后的字体配置
 * @example
 * ```js
 * registerFont({
 *  font: 'Alibaba PuHuiTi',
 *  name: '阿里巴巴普惠体',
 *  url: {
 *    regular: 'https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css'
 *  }
 *})
 * ```
 * @description
 * 字体准备说明：https://chinese-font.netlify.app/zh-cn/post/simple_tutorial
 */
export declare function registerFont(font: Font): Font;
export declare function unregisterFont(font: string): Font | null;
