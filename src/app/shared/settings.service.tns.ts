import { Injectable } from '@angular/core';

import * as appSettings from 'tns-core-modules/application-settings';

const TODO_PATH_SETTING = 'todoFilePath';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {

    constructor() {}

    get path(): string {
        return appSettings.getString(TODO_PATH_SETTING);
    }

    set path(path: string) {
        if (!path) {
            throw Error('Path can not be empty.');
        }
        appSettings.setString(TODO_PATH_SETTING, path);
        console.log('path saved to settings');
    }
}
