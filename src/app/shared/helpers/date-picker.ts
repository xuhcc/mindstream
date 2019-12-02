import { IMyDateModel } from 'angular-mydatepicker';
import { first } from 'rxjs/operators';

export function openDatePicker(datepicker): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const opened = datepicker.toggleCalendar();
        if (!opened) {
            reject(new Error('Picker cancelled'));
            return;
        }
        datepicker.dateChanged.pipe(first()).subscribe((result: IMyDateModel) => {
            resolve(result.singleDate.formatted);
        });
    });
}
