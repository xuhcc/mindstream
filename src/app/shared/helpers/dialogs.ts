export function showActionDialog(
    title: string,
    message: string,
    actions: string[],
): Promise<string> {
    console.log(title);
    console.log(message);
    console.log(actions);
    return new Promise((resolve) => resolve(''));
}

export function showConfirmDialog(title: string, message: string): Promise<boolean> {
    console.log(title);
    console.log(message);
    return new Promise((resolve) => resolve(true));
}
