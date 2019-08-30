export function dateToString(date: Date): string {
    const year = date.getFullYear();
    const month = ((date.getMonth() + 1 < 10) ? '0' : '') + (date.getMonth() + 1);
    const day = ((date.getDate() < 10) ? '0' : '') + date.getDate();
    return `${year}-${month}-${day}`;
}
