export function injectStyleOnce(id, styles) {
    if (document.getElementById(id))
        return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = styles;
    document.head.appendChild(style);
}
