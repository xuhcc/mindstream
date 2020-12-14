import { Toasty, ToastPosition, ToastDuration } from '@triniwiz/nativescript-toasty'

export function showToast(text: string) {
    try {
        const toast = new Toasty({
            text: text,
            position: ToastPosition.BOTTOM,
            duration: ToastDuration.LONG,
            yAxisOffset: 10,
        })
        toast.show()
    } catch (error) {
        // Log error if view is not ready
        console.warn(error)
    }
}
