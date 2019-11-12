import { Injectable } from '@angular/core';

import { NgxSmartModalService } from 'ngx-smart-modal';
import { first } from 'rxjs/operators';

import { DialogComponent } from './dialog.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {

    constructor(private modalService: NgxSmartModalService) { }

    action(
        title: string,
        message: string,
        actions: string[],
    ): Promise<string> {
        return new Promise<string>((resolve) => {
            const modal = this.modalService
                .create('dialog', DialogComponent)
                .setData({
                    title: title,
                    message: message,
                    actions: actions,
                })
                .open();
            modal.onClose.pipe(first()).subscribe(() => {
                const data = modal.getData();
                this.modalService.removeModal('dialog');
                resolve(data.result);
            });
        });
    }

    confirm(title: string, message: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const modal = this.modalService
                .create('dialog', DialogComponent)
                .setData({
                    title: title,
                    message: message,
                    showCancel: true,
                    showOK: true,
                })
                .open();
            modal.onClose.pipe(first()).subscribe(() => {
                const data = modal.getData();
                this.modalService.removeModal('dialog');
                resolve(data.result);
            });
        });
    }
}
