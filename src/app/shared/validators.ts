import { AbstractControl, ValidatorFn } from '@angular/forms'

import { isValidPath } from './file.service'

export function FilePathValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const path = control.value
        if (!path) {
            return
        }
        if (!isValidPath(path)) {
            return {
                invalidPath: {
                    value: control.value,
                },
            }
        }
    }
}
