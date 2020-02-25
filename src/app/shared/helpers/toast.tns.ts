import { Toasty, ToastPosition, ToastDuration } from 'nativescript-toasty';

export function showToast(text: string) {
    try {
        const toast = new Toasty({
            text: text,
            position: ToastPosition.BOTTOM,
            duration: ToastDuration.LONG,
        });
        toast.show();
    } catch (error) {
        // Log error if view is not ready
        console.warn(error);
    }
}
