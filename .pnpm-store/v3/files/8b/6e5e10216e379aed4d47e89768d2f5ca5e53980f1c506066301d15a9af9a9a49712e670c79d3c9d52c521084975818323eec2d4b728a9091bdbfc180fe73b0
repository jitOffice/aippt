export function join(...paths) {
    return paths
        .map((path) => path.replace(/^\/+|\/+$/g, ''))
        .filter((path) => path.trim().length > 0)
        .join('/');
}
