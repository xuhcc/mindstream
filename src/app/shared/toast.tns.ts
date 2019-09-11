import { Toasty, ToastPosition, ToastDuration } from 'nativescript-toasty';

export function showToast(text: string) {
    const toast = new Toasty({
        text: text,
        position: ToastPosition.BOTTOM,
        duration: ToastDuration.LONG,
    });
    toast.show();
}
