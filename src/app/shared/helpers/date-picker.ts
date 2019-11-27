import { IMyDateModel } from 'angular-mydatepicker';
import { first } from 'rxjs/operators';

export function openDatePicker(datepicker): Promise<string> {
    // TODO: use toggleCalendar
    datepicker.openCalendar();
    return new Promise<string>((resolve) => {
        datepicker.dateChanged.pipe(first()).subscribe((result: IMyDateModel) => {
            resolve(result.singleDate.formatted);
        });
    });
}
