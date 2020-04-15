import { Component, OnInit, ViewContainerRef } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

import { RouterService } from '../shared/router.service'
import { SettingsService } from '../shared/settings.service'
import { SideDrawerService } from '../nav/sidedrawer.service'
import { TodoFileService } from '../shared/todo-file.service'
import { FilePathValidator } from '../shared/validators'
import { openFilePicker } from '../shared/helpers/file-picker'
import { hideActionBar } from '../shared/helpers/page'
import { showToast } from '../shared/helpers/toast'

@Component({
    selector: 'ms-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

    welcomeText = 'Mindstream is a task management app that uses ' +
        '<a href="http://todotxt.org/" target="_blank">todo.txt</a> file format.';

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: RouterService,
        private settings: SettingsService,
        private sideDrawer: SideDrawerService,
        private todoFile: TodoFileService,
        private view: ViewContainerRef,
    ) {
        hideActionBar(view)
    }

    ngOnInit() {
        this.sideDrawer.lock()
        this.form = this.formBuilder.group({
            filePath: [
                this.settings.path,
                FilePathValidator(),
            ],
        })
    }

    openPicker() {
        openFilePicker().then((filePath) => {
            if (filePath) {
                this.form.controls.filePath.setValue(filePath)
            }
        }).catch((error) => {
            console.warn(error)
            showToast(error.toString())
        })
    }

    save() {
        if (!this.form.valid) {
            return
        }
        const filePath = this.form.value.filePath
        let filePromise
        if (!filePath) {
            // Create empty todo.txt
            filePromise = this.todoFile.create()
        } else {
            filePromise = new Promise((resolve) => resolve(filePath))
        }
        filePromise.then((path: string) => {
            this.settings.path = path
            this.todoFile.initialLoad().then(() => {
                this.sideDrawer.unlock()
                this.router.navigate(['/tasks'], {clearHistory: true})
            })
        })
    }

}
