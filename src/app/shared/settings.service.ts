import { Injectable } from '@angular/core';

import { Settings, TaskFilter } from './settings';
import {
    setValue,
    getValue,
    removeValue,
} from './helpers/storage';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {

    constructor() { }

    get path(): string {
        return getValue(Settings.Path);
    }

    set path(path: string) {
        if (!path) {
            throw Error('Path can not be empty.');
        }
        setValue(Settings.Path, path);
    }

    get filter(): TaskFilter {
        const filterStr = getValue(Settings.TaskFilter);
        if (!filterStr) {
            return {};
        }
        const filter = JSON.parse(filterStr);
        if (filter.dueDate) {
            filter.dueDate = new Date(filter.dueDate);
        }
        return filter;
    }

    set filter(filter: TaskFilter) {
        const filterStr = JSON.stringify(filter);
        setValue(Settings.TaskFilter, filterStr);
    }

    get ordering(): string[] {
        const orderingStr = getValue(Settings.TaskOrdering);
        if (!orderingStr) {
            return [];
        }
        return JSON.parse(orderingStr);
    }

    set ordering(ordering: string[]) {
        const orderingStr = JSON.stringify(ordering);
        setValue(Settings.TaskOrdering, orderingStr);
    }

    reset() {
        removeValue(Settings.TaskFilter);
        removeValue(Settings.TaskOrdering);
        removeValue(Settings.Path);
    }
}
