import { ModalDatetimepicker, PickerOptions } from 'nativescript-modal-datetimepicker';

import { dateToString, stringToDate } from '../misc';

export function openDatePicker(initialDate: string, datepicker: void): Promise<string> { // eslint-disable-line @typescript-eslint/no-unused-vars
    const picker = new ModalDatetimepicker();
    const options: PickerOptions = {
        theme: 'overlay',
        startingDate: initialDate ? stringToDate(initialDate) : new Date(),
    };
    return picker.pickDate(options).then((result) => {
        if (!result) {
            throw new Error('Picker cancelled');
        }
        const date = new Date(Date.UTC(result.year, result.month - 1, result.day));
        return dateToString(date);
    });
}
