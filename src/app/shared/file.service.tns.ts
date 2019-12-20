import { Injectable } from '@angular/core';

import { knownFolders, File, Folder } from '@nativescript/core/file-system';
import { isAndroid } from '@nativescript/core/platform';
import * as permissions from 'nativescript-permissions';

export function isValidPath(path: string): boolean {
    if (path && File.exists(path) && !Folder.exists(path)) {
        return true;
    }
    return false;
}

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

    async create(name: string): Promise<string> {
        const hasPermission = await this.checkPermission();
        if (!hasPermission) {
            throw new Error('permission denied');
        }
        const documents = knownFolders.documents();
        const file = documents.getFile(name);
        if (isValidPath(file.path)) {
            console.warn('file already exists on default path');
        } else {
            // Write empty string to create a file
            await file.writeText('');
        }
        return file.path;
    }
}
