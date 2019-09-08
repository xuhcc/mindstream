import { Component, OnInit, ViewContainerRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SideDrawerService } from '../nav/sidedrawer.service';
import { RouterService } from '../shared/router.service';
import { TodoFileService } from '../shared/todo-file.service';
import { SettingsService } from '../shared/settings.service';
import { openFilePicker } from '../shared/file-picker';

@Component({
    selector: 'ms-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: RouterService,
        private todoFile: TodoFileService,
        private settings: SettingsService,
        private sideDrawer: SideDrawerService,
        private viewContainerRef: ViewContainerRef,
        private ngZone: NgZone,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            filePath: [
                this.settings.path,
                Validators.required,
            ],
        });
    }

    openDrawer() {
        this.sideDrawer.open(this.viewContainerRef);
    }

    openPicker() {
        openFilePicker().then((filePath) => {
            // TODO: ngZone.run() may be unnecessary here
            this.ngZone.run(() => {
                console.log(`picked file ${filePath}`);
                this.form.controls.filePath.setValue(filePath);
            });
        });
    }

    goBack() {
        this.router.backToPreviousPage();
    }

    save() {
        const filePath = this.form.value.filePath;
        this.settings.path = filePath;
        this.todoFile.load();
        this.router.navigate(['/tasks']);
    }

}
