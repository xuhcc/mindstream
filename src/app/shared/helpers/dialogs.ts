export function showActionDialog(
    title: string,
    message: string,
    actions: string[],
): Promise<string> {
    return new Promise<string>((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        const titleElement = document.createElement('div');
        titleElement.innerHTML = title;
        dialog.appendChild(titleElement);
        actions.forEach((action) => {
            const actionLink = document.createElement('a');
            actionLink.innerHTML = action;
            dialog.appendChild(actionLink);
            // Handle click event
            actionLink.addEventListener('click', () => {
                document.body.removeChild(dialog);
                resolve(action);
            });
        });
        const body = document.getElementsByTagName('body')[0];
        body.insertBefore(dialog, body.firstChild);
    });
}

export function showConfirmDialog(title: string, message: string): Promise<boolean> {
    console.log(title);
    console.log(message);
    return new Promise((resolve) => resolve(true));
}
