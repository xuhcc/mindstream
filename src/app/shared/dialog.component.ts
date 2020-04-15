import { Component, ChangeDetectorRef } from '@angular/core'

import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal'

@Component({
    template: `
        <div class="dialog-title">{{ title }}</div>
        <div class="dialog-message" *ngIf="message">{{ message }}</div>
        <div *ngFor="let action of actions">
            <a (click)="close(action)">{{ action }}</a>
        </div>
        <div *ngIf="showCancel">
            <a (click)="close(false)">Cancel</a>
        </div>
        <div *ngIf="showOK">
            <a (click)="close(true)">OK</a>
        </div>
    `,
})
export class DialogComponent {

    loader: any;
    modal: NgxSmartModalComponent;

    title: string;
    message: string;
    actions: string[];
    showCancel: boolean;
    showOK: boolean;

    constructor(
        private modalService: NgxSmartModalService,
        private changeDetector: ChangeDetectorRef,
    ) {
        // Workaround for
        // https://github.com/biig-io/ngx-smart-modal/issues/235
        this.loader = setInterval(() => {
            try {
                this.modal = this.modalService.getModal('dialog')
            } catch (error) {
                // Not loaded yet
                return
            }
            clearInterval(this.loader)
            this.onInit(this.modal.getData())
        }, 100)
    }

    onInit(data: any) {
        this.title = data.title
        this.message = data.message
        this.actions = data.actions || []
        this.showCancel = data.showCancel
        this.showOK = data.showOK
        this.changeDetector.detectChanges()
    }

    close(value: any) {
        this.modal.setData({result: value}, true)
        this.modal.close()
    }
}
