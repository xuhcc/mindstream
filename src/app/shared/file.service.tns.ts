import { Injectable } from '@angular/core';

import { File, Folder } from 'tns-core-modules/file-system';
import { isAndroid } from 'tns-core-modules/platform';
import * as permissions from 'nativescript-permissions';

@Injectable({
    providedIn: 'root',
})
export class FileService {

    private async checkPermission(): Promise<boolean> {
        let hasPermission = true;
        if (isAndroid) {
            const permissionName = 'android.permission.WRITE_EXTERNAL_STORAGE';
            hasPermission = permissions.hasPermission(permissionName);
            if (!hasPermission) {
                try {
                    const result = await permissions.requestPermission(
                        permissionName,
                        'Your permission is required.',
                    );
                    hasPermission = result[permissionName];
                } catch (error) {
                    hasPermission = false;
                }
            }
        }
        return hasPermission;
    }

    async read(path: string): Promise<string> {
        let content;
        const hasPermission = await this.checkPermission();
        if (hasPermission) {
            const file = File.fromPath(path);
            content = await file.readText();
        } else {
            throw new Error('permission denied');
        }
        return content;
    }

    async write(path: string, content: string): Promise<void> {
        const file = File.fromPath(path);
        await file.writeText(content);
    }
}

export function isValidPath(path: string): boolean {
    if (path && File.exists(path) && !Folder.exists(path)) {
        return true;
    }
    return false;
}
