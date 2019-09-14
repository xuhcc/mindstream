import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { openDatePicker } from '../shared/date-picker';
import { RouterService } from '../shared/router.service';
import { TodoFileService } from '../shared/todo-file.service';
import { DATESTRING_VALIDATOR_REGEXP, PRIORITY_VALIDATOR_REGEXP } from '../shared/validators';
import { Task } from '../shared/task';

@Component({
    selector: 'ms-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    taskId: number;
    projects: string[];
    showProjectSuggestions = false;

    @ViewChild('taskTextField', {static: false})
    taskTextField: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        private router: RouterService,
        private route: ActivatedRoute,
        private todoFile: TodoFileService,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            text: [
                '',
                Validators.required,
            ],
            project: [
                '',
            ],
            priority: [
                '',
                Validators.pattern(PRIORITY_VALIDATOR_REGEXP),
            ],
            dueDate: [
                '',
                Validators.pattern(DATESTRING_VALIDATOR_REGEXP),
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
            this.taskTextField.nativeElement.focus();
        }, 100);
    }

    get title(): string {
        return this.taskId ? 'Edit task' : 'Add task';
    }

    getFilteredProjects(): string[] {
        if (!this.showProjectSuggestions) {
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

    setProject(project: string) {
        this.form.controls.project.setValue(project);
    }

    clearProject() {
        this.form.controls.project.reset();
    }

    showDatePicker() {
        openDatePicker().then((dateString: string) => {
            this.form.controls.dueDate.setValue(dateString);
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
