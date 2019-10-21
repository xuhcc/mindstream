import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export function isValidPath(path: string): boolean {
    console.log(path);
    return true;
}

@Injectable({
    providedIn: 'root',
})
export class FileService {

    backendUrl = 'http://localhost:3003';

    constructor(private http: HttpClient) { }

    async read(path: string): Promise<string> {
        const encodedPath = encodeURIComponent(path);
        const url = `${this.backendUrl}/file/${encodedPath}`
        const response = await this.http.get(url).toPromise();
        return (response as any).content;
    }

    async write(path: string, content: string): Promise<void> {
        const encodedPath = encodeURIComponent(path);
        const url = `${this.backendUrl}/file/${encodedPath}`
        await this.http.post(url, {content: content}).toPromise();
    }

    create(name: string): Promise<string> {
        return new Promise(resolve => resolve(name));
    }

}
