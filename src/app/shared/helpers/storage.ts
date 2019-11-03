export function setValue(key: string, value: string): void {
    localStorage.setItem(key, value);
}

export function getValue(key: string): string {
    return localStorage.getItem(key);
}

export function removeValue(key: string): void {
    localStorage.removeItem(key);
}
