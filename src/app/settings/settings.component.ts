import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SideDrawerService } from '../nav/sidedrawer.service';
import { RouterService } from '../shared/router.service';
import { TodoFileService } from '../shared/todo-file.service';
import { SettingsService } from '../shared/settings.service';
import { openFilePicker } from '../shared/file-picker';
import { FilePathValidator } from '../shared/validators';

@Component({
    selector: 'ms-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

    title = 'Settings';
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: RouterService,
        private todoFile: TodoFileService,
        private settings: SettingsService,
        private sideDrawer: SideDrawerService,
        private viewContainerRef: ViewContainerRef,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            filePath: [
                this.settings.path,
                [Validators.required, FilePathValidator()],
            ],
        });
    }

    openDrawer() {
        this.sideDrawer.open(this.viewContainerRef);
    }

    openPicker() {
        openFilePicker().then((filePath) => {
            console.info(`picked file ${filePath}`);
            this.form.controls.filePath.setValue(filePath);
        }).catch((error) => {
            console.warn(error);
        });
    }

    goBack() {
        this.router.backToPreviousPage();
    }

    save() {
        const filePath = this.form.value.filePath;
        this.settings.path = filePath;
        this.todoFile.load().then(() => {
            this.router.navigate(['/tasks']);
        });
    }

}
