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
    return new Promise<boolean>((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        const titleElement = document.createElement('div');
        titleElement.innerHTML = title;
        dialog.appendChild(titleElement);
        const messageElement = document.createElement('div');
        messageElement.innerHTML = message;
        dialog.appendChild(messageElement);
        const cancelBtn = document.createElement('a');
        cancelBtn.innerHTML = 'Cancel';
        dialog.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            resolve(false);
        });
        const okBtn = document.createElement('a');
        okBtn.innerHTML = 'OK';
        dialog.appendChild(okBtn);
        okBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            resolve(true);
        });
        const body = document.getElementsByTagName('body')[0];
        body.insertBefore(dialog, body.firstChild);
    });
}
