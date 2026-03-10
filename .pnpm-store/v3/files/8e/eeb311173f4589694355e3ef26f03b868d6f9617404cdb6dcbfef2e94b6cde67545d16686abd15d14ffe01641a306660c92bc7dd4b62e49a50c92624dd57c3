export function getViewBox(svg) {
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
        const [x, y, width, height] = viewBox.split(' ').map(Number);
        return { x, y, width, height };
    }
    const widthStr = svg.getAttribute('width');
    const heightStr = svg.getAttribute('height');
    const width = Number(widthStr) || 0;
    const height = Number(heightStr) || 0;
    return { x: 0, y: 0, width, height };
}
export function calculateZoomedViewBox(current, factor, pivot) {
    const newWidth = current.width * factor;
    const newHeight = current.height * factor;
    const newX = pivot.x - (pivot.x - current.x) * factor;
    const newY = pivot.y - (pivot.y - current.y) * factor;
    return { x: newX, y: newY, width: newWidth, height: newHeight };
}
export function viewBoxToString(box) {
    return `${box.x} ${box.y} ${box.width} ${box.height}`;
}
