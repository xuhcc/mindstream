import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { getVersionNameSync } from 'nativescript-appversion';

import { APP_NAME } from '../app.constants';

@Component({
    selector: 'ms-nav-modal',
    templateUrl: './nav-modal.component.html',
    styleUrls: ['./nav-modal.component.scss'],
})
export class NavModalComponent {

    title = APP_NAME;
    subtitle: string;
    pages: {title: string; url: string}[];

    constructor(
        private modalParams: ModalDialogParams,
    ) {
        this.subtitle = `v${getVersionNameSync()}`;
        this.pages = modalParams.context;
    }

    navigateTo(url: string): void {
        this.modalParams.closeCallback(url);
    }

}
