export function generateUID(value: number | string): string {
    const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const combined = `${value}-${Date.now()}-${Math.random()}`;

    let hash = 2166136261;
    for (let i = 0; i < combined.length; i++) {
        hash ^= combined.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    hash >>>= 0;

    let id = '';
    for (let i = 0; i < 5; i++) {
        id = BASE62[hash % 62] + id;
        hash = Math.floor(hash / 62);
    }
    return id;
}
