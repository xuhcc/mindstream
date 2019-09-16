import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { dateToString } from '../shared/misc';
import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';
import { TodoFileService } from '../shared/todo-file.service';
import { Task, PROJECT_REGEXP, PRIORITY_REGEXP, DATESTRING_REGEXP, RECURRENCE_REGEXP } from '../shared/task';
import { openDatePicker } from '../shared/helpers/date-picker';
import { showActionDialog } from '../shared/helpers/dialogs';
import { focusOnInput, enableInputSuggestions } from '../shared/helpers/input';
import { isIOS } from '../shared/helpers/platform';

@Component({
    selector: 'ms-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    taskId: number;
    projects: string[];
    projectSuggestionsVisible = false;
    projectSuggestionsLocked = false;

    @ViewChild('taskTextField', {static: false})
    taskTextField: ElementRef;

    @ViewChild('taskProjectField', {static: false})
    taskProjectField: ElementRef;

    constructor(
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
            project: [
                this.settings.filter.project,
                Validators.pattern(PROJECT_REGEXP),
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
            const task = new Task(this.todoFile.todoItems[this.taskId]);
            this.form.setValue(task.toTaskData());
        }
        this.projects = this.todoFile.getProjects();
    }

    ngAfterViewInit(): void {
        // Focus on task text field
        setTimeout(() => {
            focusOnInput(this.taskTextField);
            enableInputSuggestions(this.taskTextField);
        }, 100);
    }

    get title(): string {
        return this.taskId ? 'Edit task' : 'Add task';
    }

    getFilteredProjects(): string[] {
        if (!this.projectSuggestionsVisible) {
            return [];
        }
        const search = this.form.controls.project.value;
        if (!search) {
            return [];
        }
        const searchRegexp = new RegExp(search, 'iu');
        return this.projects.filter((project) => {
            return project.search(searchRegexp) !== -1;
        }).sort();
    }

    showProjectSuggestions() {
        this.projectSuggestionsVisible = true;
    }

    hideProjectSuggestions() {
        // On iOS "blur" event is emitted before "tap" event,
        // so we need to delay hiding
        setTimeout(() => {
            if (this.projectSuggestionsLocked) {
                // Unlock suggestion list and move focus back to project field
                this.projectSuggestionsLocked = false;
                this.taskProjectField.nativeElement.focus();
            } else {
                // Hide suggestion list
                this.projectSuggestionsVisible = false;
            }
        }, 100);
    }

    setProject(project: string) {
        if (isIOS) {
            // Prevent suggestions list from hiding on blur event
            this.projectSuggestionsLocked = true;
        }
        this.form.controls.project.setValue(project);
    }

    clearProject() {
        this.form.controls.project.reset();
    }

    setDueToday() {
        const dateStr = dateToString(new Date());
        this.form.controls.dueDate.setValue(dateStr);
    }

    showDatePicker() {
        openDatePicker().then((dateString: string) => {
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
        showActionDialog(
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

    goBack() {
        this.router.backToPreviousPage();
    }

}
