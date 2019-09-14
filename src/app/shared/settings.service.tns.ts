import { Injectable } from '@angular/core';

import * as appSettings from 'tns-core-modules/application-settings';

import { Settings, TaskFilter } from './settings';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {

    constructor() {}

    get path(): string {
        return appSettings.getString(Settings.Path);
    }

    set path(path: string) {
        if (!path) {
            throw Error('Path can not be empty.');
        }
        appSettings.setString(Settings.Path, path);
    }

    get filter(): TaskFilter {
        const filterStr = appSettings.getString(Settings.TaskFilter);
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
        appSettings.setString(Settings.TaskFilter, filterStr);
    }
}
