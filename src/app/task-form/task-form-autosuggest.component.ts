import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { escapeRegExp } from '../shared/misc';
import { isAndroid, isIOS, isWeb } from '../shared/helpers/platform';

@Component({
    selector: 'task-form-autosuggest',
    templateUrl: './task-form-autosuggest.component.html',
    styleUrls: ['./task-form-autosuggest.component.scss'],
})
export class TaskFormAutosuggestComponent {

    @Input() items: string[];
    @Input() inputControl: FormControl;

    isVisible = false;
    isLocked = false;
    highlightedItem: string;

    @ViewChild('inputField', {static: false})
    inputField: ElementRef;

    getSuggestions(): string[] {
        if (!this.isVisible) {
            return [];
        }
        const value = this.inputControl.value;
        if (!value) {
            return [];
        }
        const pieces = value.split(/\s+/);
        if (pieces.length === 0) {
            return [];
        }
        const search = pieces[pieces.length - 1];
        const searchRegexp = new RegExp(escapeRegExp(search), 'iu');
        return this.items.filter((item: string) => {
            return item.search(searchRegexp) !== -1;
        }).sort();
    }

    select(item: string): void {
        if (isIOS || isWeb) {
            // Prevent suggestions list from hiding on blur event
            this.isLocked = true;
        }
        const pieces = this.inputControl.value.split(/\s+/);
        pieces[pieces.length - 1] = item;
        const newValue = pieces.join(' ');
        this.inputControl.setValue(newValue);
        if (isAndroid) {
            // Move cursor to the end of string
            this.inputField.nativeElement.android.setSelection(newValue.length);
        }
    }

    removeItem(): void {
        const pieces = this.inputControl.value.split(/\s+/);
        pieces.pop();
        const newValue = pieces.join(' ');
        this.inputControl.setValue(newValue);
        if (isAndroid) {
            // Move cursor to the end of string
            this.inputField.nativeElement.android.setSelection(newValue.length);
        }
    }

    show(): void {
        this.isVisible = true;
    }

    hide(): void {
        // On iOS and Web the "blur" event is emitted before "tap" event,
        // so we need to delay hiding
        setTimeout(() => {
            if (this.isLocked) {
                // Unlock suggestion list and move focus back to input field
                this.isLocked = false;
                this.inputField.nativeElement.focus();
            } else {
                // Hide suggestion list
                this.isVisible = false;
            }
        }, 100);

    }

    navigate(event: any): void {
        if (isWeb) {
            // Select project from keyboard
            const key = event.key;
            if (key === 'ArrowUp' || key === 'ArrowDown') {
                const suggestions = this.getSuggestions();
                let highlightedIndex = suggestions.indexOf(this.highlightedItem);
                if (key === 'ArrowDown' && highlightedIndex < suggestions.length - 1) {
                    // Select next project
                    highlightedIndex++;
                } else if (key === 'ArrowUp' && highlightedIndex > 0) {
                    // Select previous project
                    highlightedIndex--;
                }
                this.highlightedItem = suggestions[highlightedIndex];
            }
            if (key === 'Enter' && this.highlightedItem) {
                event.preventDefault();
                this.select(this.highlightedItem);
                delete this.highlightedItem;
            }
        }
    }

}
