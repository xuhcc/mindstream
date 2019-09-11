import { makeText } from 'nativescript-toast';

export function showToast(text: string) {
    const toast = makeText(text, 'long');
    toast.show();
}
