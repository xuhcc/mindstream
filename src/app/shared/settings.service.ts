import { Injectable } from '@angular/core';

const TODO_PATH_SETTING = 'todoFilePath';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {

    constructor() { }

    get path(): string {
        return localStorage.getItem(TODO_PATH_SETTING);
    }

    set path(path: string) {
        if (!path) {
            throw Error('Path can not be empty.');
        }
        localStorage.setItem(TODO_PATH_SETTING, path);
        console.log(path);
    }
}
