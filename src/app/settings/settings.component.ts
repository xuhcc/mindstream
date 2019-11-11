import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SideDrawerService } from '../nav/sidedrawer.service';
import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';
import { TodoFileService } from '../shared/todo-file.service';
import { FilePathValidator } from '../shared/validators';
import { openFilePicker } from '../shared/helpers/file-picker';

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
        private settings: SettingsService,
        private sideDrawer: SideDrawerService,
        private todoFile: TodoFileService,
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
        this.todoFile.initialLoad().then(() => {
            this.router.navigate(['/tasks']);
        });
    }

    reset() {
        this.settings.reset();
        this.form.reset();
        this.router.navigate(['/welcome'], {
            clearHistory: true,
        });
    }

}
