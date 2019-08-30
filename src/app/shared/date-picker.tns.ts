import { ModalDatetimepicker } from 'nativescript-modal-datetimepicker';

import { dateToString } from './misc';

export function openDatePicker(): Promise<string> {
    const picker = new ModalDatetimepicker();
    return picker.pickDate({
        title: 'Select date',
        theme: 'light',
    }).then((result) => {
        const date = new Date(Date.UTC(result.year, result.month - 1, result.day));
        return dateToString(date);
    });
}
