import { Injectable } from '@angular/core'

import { NgxSmartModalService } from 'ngx-smart-modal'
import { first } from 'rxjs/operators'

import { DialogComponent } from './dialog.component'

@Injectable({
    providedIn: 'root',
})
export class DialogService {

    constructor(private modalService: NgxSmartModalService) { }

    private createDialog(params: {}): Promise<any> {
        return new Promise<any>((resolve) => {
            const modal = this.modalService
                .create('dialog', DialogComponent)
                .setData(params)
                .open()
            modal.onClose.pipe(first()).subscribe(() => {
                const data = modal.getData()
                this.modalService.removeModal('dialog')
                resolve(data.result)
            })
            modal.onDismiss.pipe(first()).subscribe(() => {
                this.modalService.removeModal('dialog')
                resolve(null)
            })
        })
    }

    action(
        title: string,
        message: string,
        actions: string[],
    ): Promise<string> {
        return this.createDialog({
            title: title,
            message: message,
            actions: actions,
        })
    }

    confirm(title: string, message: string): Promise<boolean> {
        return this.createDialog({
            title: title,
            message: message,
            showCancel: true,
            showOK: true,
        })
    }
}
