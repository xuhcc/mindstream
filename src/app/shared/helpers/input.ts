import { ElementRef } from '@angular/core'

export function focusOnInput(input: ElementRef) {
    input.nativeElement.focus()
}

export function enableInputSuggestions(input: ElementRef) { // eslint-disable-line @typescript-eslint/no-unused-vars
}
