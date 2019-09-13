export function showConfirmDialog(title: string, message: string): Promise<boolean> {
    console.log(title);
    console.log(message);
    return new Promise((resolve) => resolve(true));
}
