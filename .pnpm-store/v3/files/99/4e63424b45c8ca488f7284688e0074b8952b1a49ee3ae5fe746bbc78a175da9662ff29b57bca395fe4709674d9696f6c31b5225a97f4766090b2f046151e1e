import { setAttributes, traverse } from '../../utils/index.js';
import { parseDynamicAttributes } from '../utils/index.js';
export function renderBaseElement(svg, attrs) {
    if (attrs && Object.keys(attrs).length > 0) {
        traverse(svg, (element) => {
            const parsedAttrs = parseDynamicAttributes(element, attrs);
            setAttributes(element, parsedAttrs);
        });
    }
}
