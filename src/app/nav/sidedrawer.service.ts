import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class SideDrawerService {

    open(viewContainerRef?: any) {
        console.log(viewContainerRef)
    }

    lock() {} // eslint-disable-line @typescript-eslint/no-empty-function

    unlock() {} // eslint-disable-line @typescript-eslint/no-empty-function
}
