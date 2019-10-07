import { Injectable } from '@angular/core';

export function isValidPath(path: string): boolean {
    console.log(path);
    return true;
}

@Injectable({
    providedIn: 'root',
})
export class FileService {

    reading: Promise<string>;

    read(path: string): Promise<string> {
        if (this.reading) {
            // File picker already present
            return this.reading;
        }
        this.reading = new Promise<string>((resolve) => {
            // Create file input
            const inputWrapper = document.createElement('div');
            inputWrapper.setAttribute('id', 'file-picker');
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            const body = document.getElementsByTagName('body')[0];
            body.insertBefore(inputWrapper, body.firstChild);
            inputWrapper.appendChild(input);
            // Handle change event
            input.addEventListener('change', (event) => {
                const fileList: FileList = (event.target as any).files;
                if (fileList.length > 0) {
                    const file: File = fileList[0];
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                        const content = (readerEvent.target as any).result;
                        body.removeChild(inputWrapper);
                        delete this.reading;
                        resolve(content);
                    };
                    reader.readAsText(file, 'UTF-8');
                }
            });
        });
        return this.reading;
    }

    write(path: string, content: string): Promise<void> {
        return new Promise<void>((resolve) => {
            const file = new Blob([content], {type: 'text/plain'});
            const link = document.createElement('a');
            const url = URL.createObjectURL(file);
            link.href = url;
            link.download = path.split('/').pop();
            document.body.appendChild(link);
            link.click();
            setTimeout(function () {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                resolve();
            }, 0);
        });
    }

    create(name: string): Promise<string> {
        return new Promise(resolve => resolve(name));
    }
}
