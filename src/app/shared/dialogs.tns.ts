import { confirm } from 'tns-core-modules/ui/dialogs';

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
