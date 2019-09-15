import { action, confirm } from 'tns-core-modules/ui/dialogs';

export function showActionDialog(
    title: string,
    message: string,
    actions: string[],
): Promise<string> {
    const options = {
        title: title,
        message: message,
        actions: actions,
        cancelButtonText: 'Cancel',
    };
    return action(options);
}

export function showConfirmDialog(title: string, message: string): Promise<boolean> {
    const options = {
        title: title,
        message: message,
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        neutralButtonText: 'Cancel',
    };
    return confirm(options);
}
