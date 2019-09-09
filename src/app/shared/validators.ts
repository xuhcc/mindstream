import { AbstractControl, ValidatorFn } from '@angular/forms';

import { isValidPath } from './file.service';

export const DATESTRING_VALIDATOR_REGEXP = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])$/;
export const PRIORITY_VALIDATOR_REGEXP = /^[A-Z]$/;

export function FilePathValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const path = control.value;
        if (!isValidPath(path)) {
            return {
                invalidPath: {
                    value: control.value,
                },
            };
        }
    };
}
