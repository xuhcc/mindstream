import { ElementRef } from '@angular/core'

import { isAndroid } from '@nativescript/core/platform'

export function focusOnInput(input: ElementRef) {
    input.nativeElement.focus()
}

export function enableInputSuggestions(input: ElementRef) {
    // Fix autosuggestion bug on Android
    if (isAndroid) {
        const inputType = input.nativeElement.android.getInputType()
        input.nativeElement.android.setInputType(
            inputType ^ android.text.InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE,
        )
    }
}
