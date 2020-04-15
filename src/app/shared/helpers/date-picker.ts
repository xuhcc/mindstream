import { AngularMyDatePickerDirective, IMyDateModel } from 'angular-mydatepicker'
import { first } from 'rxjs/operators'

import { stringToDate } from '../misc'

export function openDatePicker(initialDate: string, datepicker: AngularMyDatePickerDirective): Promise<string> {
    const initialValue: IMyDateModel = {
        isRange: false,
        singleDate: {
            jsDate: initialDate ? stringToDate(initialDate) : new Date(),
        },
    }
    return new Promise<string>((resolve, reject) => {
        datepicker.writeValue(initialValue)
        const opened = datepicker.toggleCalendar()
        if (!opened) {
            reject(new Error('Picker cancelled'))
            return
        }
        datepicker.dateChanged.pipe(first()).subscribe((result: IMyDateModel) => {
            resolve(result.singleDate.formatted)
        })
    })
}
