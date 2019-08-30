import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SideDrawerService {

    constructor() { }

    open(viewContainerRef?: any) {
        console.log(viewContainerRef);
    }
}
