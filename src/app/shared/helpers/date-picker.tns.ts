import { ModalDatetimepicker } from 'nativescript-modal-datetimepicker';

import { dateToString } from '../misc';

export function openDatePicker(datepicker: void): Promise<string> { // eslint-disable-line @typescript-eslint/no-unused-vars
    const picker = new ModalDatetimepicker();
    return picker.pickDate({
        theme: 'overlay',
    }).then((result) => {
        if (!result) {
            throw new Error('Picker cancelled');
        }
        const date = new Date(Date.UTC(result.year, result.month - 1, result.day));
        return dateToString(date);
    });
}
