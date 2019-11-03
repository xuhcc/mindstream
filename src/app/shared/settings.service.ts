import { Injectable } from '@angular/core';

import { Settings, TaskFilter } from './settings';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {

    constructor() { }

    get path(): string {
        return localStorage.getItem(Settings.Path);
    }

    set path(path: string) {
        if (!path) {
            throw Error('Path can not be empty.');
        }
        localStorage.setItem(Settings.Path, path);
    }

    get filter(): TaskFilter {
        const filterStr = localStorage.getItem(Settings.TaskFilter);
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
        localStorage.setItem(Settings.TaskFilter, filterStr);
    }

    get ordering(): string[] {
        const orderingStr = localStorage.getItem(Settings.TaskOrdering);
        if (!orderingStr) {
            return [];
        }
        return JSON.parse(orderingStr);
    }

    set ordering(ordering: string[]) {
        const orderingStr = JSON.stringify(ordering);
        localStorage.setItem(Settings.TaskOrdering, orderingStr);
    }

    reset() {
        localStorage.removeItem(Settings.TaskFilter);
        localStorage.removeItem(Settings.Path);
    }
}
