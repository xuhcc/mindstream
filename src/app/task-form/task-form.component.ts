import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { dateToString } from '../shared/misc';
import { DialogService } from '../shared/dialog.service';
import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';
import { TodoFileService } from '../shared/todo-file.service';
import {
    PROJECT_LIST_REGEXP,
    CONTEXT_LIST_REGEXP,
    PRIORITY_REGEXP,
    DATESTRING_REGEXP,
    RECURRENCE_REGEXP,
} from '../shared/task';
import { openDatePicker } from '../shared/helpers/date-picker';
import { focusOnInput, enableInputSuggestions } from '../shared/helpers/input';
import { isAndroid, isIOS } from '../shared/helpers/platform';

@Component({
    selector: 'ms-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    taskId: number;
    projects: string[];
    contexts: string[];
    priorities = ['A', 'B', 'C', 'D'];

    @ViewChild('taskTextField', {static: false})
    taskTextField: ElementRef;

    constructor(
        private dialog: DialogService,
        private formBuilder: FormBuilder,
        private router: RouterService,
        private route: ActivatedRoute,
        private settings: SettingsService,
        private todoFile: TodoFileService,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            text: [
                '',
                Validators.required,
            ],
            projects: [
                this.settings.filter.project,
                Validators.pattern(PROJECT_LIST_REGEXP),
            ],
            contexts: [
                '',
                Validators.pattern(CONTEXT_LIST_REGEXP),
            ],
            priority: [
                '',
                Validators.pattern(PRIORITY_REGEXP),
            ],
            dueDate: [
                '',
                Validators.pattern(DATESTRING_REGEXP),
            ],
            recurrence: [
                '',
                Validators.pattern(RECURRENCE_REGEXP),
            ],
        });
        this.taskId = this.route.snapshot.params.taskId;
        if (this.taskId) {
            // Pre-fill form with data if taskId is provided
            const task = this.todoFile.getTask(this.taskId);
            this.form.setValue(task.toTaskData());
        }
        this.todoFile.fileLoaded.then(() => {
            this.projects = this.todoFile.getProjects();
            this.contexts = this.todoFile.getContexts();
        });
    }

    ngAfterViewInit(): void {
        // Focus on task text field
        setTimeout(() => {
            focusOnInput(this.taskTextField);
            enableInputSuggestions(this.taskTextField);
        }, 100);
    }

    goBack() {
        this.router.backToPreviousPage();
    }

    get title(): string {
        return this.taskId ? 'Edit task' : 'Add task';
    }

    onActionBarLoaded(event: any): void {
        if (isAndroid || isIOS) {
            // Workaround for https://github.com/NativeScript/NativeScript/issues/8211
            const actionBar = event.object;
            this.form.statusChanges.subscribe(() => {
                // Delay update so it will be done after class toggle
                setTimeout(() => {
                    actionBar.update();
                }, 0);
            });
        }
    }

    setPriority(priority: string): void {
        this.form.controls.priority.setValue(priority);
    }

    setDueToday() {
        const dateStr = dateToString(new Date());
        this.form.controls.dueDate.setValue(dateStr);
    }

    setDueTomorrow() {
        const tomorrow = moment().add(1, 'day').toDate();
        const dateStr = dateToString(tomorrow);
        this.form.controls.dueDate.setValue(dateStr);
    }

    showDatePicker(datepicker?: any) {
        openDatePicker(
            this.form.controls.dueDate.value,
            datepicker,
        ).then((dateString: string) => {
            this.form.controls.dueDate.setValue(dateString);
        }).catch((error) => {
            console.warn(error);
        });
    }

    showRecurrencePicker() {
        const map = {
            'Every day': '1d',
            'Every week': '1w',
            'Every month': '1m',
        };
        this.dialog.action(
            'Task recurrence',
            'Choose recurrence interval',
            Object.keys(map),
        ).then((result: string) => {
            const recurrence = map[result];
            this.form.controls.recurrence.setValue(recurrence);
        });
    }

    save() {
        if (!this.form.valid) {
            return;
        }
        if (this.taskId) {
            this.todoFile.updateTask(this.taskId, this.form.value);
        } else {
            this.todoFile.createTask(this.form.value);
        }
        this.router.navigate(['/tasks']);
    }

}
