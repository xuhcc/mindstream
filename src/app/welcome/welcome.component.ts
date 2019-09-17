import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';
import { TodoFileService } from '../shared/todo-file.service';
import { FilePathValidator } from '../shared/validators';
import { openFilePicker } from '../shared/helpers/file-picker';
import { hideActionBar } from '../shared/helpers/page';

@Component({
    selector: 'ms-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: RouterService,
        private settings: SettingsService,
        private todoFile: TodoFileService,
        private view: ViewContainerRef,
    ) {
        hideActionBar(view);
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            filePath: [
                this.settings.path,
                [Validators.required, FilePathValidator()],
            ],
        });
    }

    openPicker() {
        openFilePicker().then((filePath) => {
            this.form.controls.filePath.setValue(filePath);
        }).catch((error) => {
            console.warn(error);
        });
    }

    save() {
        if (!this.form.valid) {
            return;
        }
        const filePath = this.form.value.filePath;
        this.settings.path = filePath;
        this.todoFile.load().then(() => {
            this.router.navigate(['/tasks'], {clearHistory: true});
        });
    }

}
