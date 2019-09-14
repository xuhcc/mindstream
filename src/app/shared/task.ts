import { TodoTxtItem } from 'jstodotxt';
import { TodoTxtExtension, DueExtension } from 'jstodotxt/jsTodoExtensions';
import * as moment from 'moment';

import { dateToString } from '../shared/misc';

export function getExtensions(): TodoTxtExtension[] {
    return [new DueExtension()];
}

export interface TaskData {
    text: string;
    project: string;
    priority: string;
    dueDate: string;
}

export class Task {

    id: number;
    todoItem: TodoTxtItem;

    constructor(todoItem: TodoTxtItem) {
        this.todoItem = todoItem;
    }

    get text(): string {
        return this.todoItem.text;
    }

    get projects(): string[] {
        return this.todoItem.projects;
    }

    get priority(): string {
        return this.todoItem.priority;
    }

    get due(): Date {
        return this.todoItem.due;
    }

    get complete(): boolean {
        return this.todoItem.complete;
    }

    get completed(): Date {
        return this.todoItem.completed;
    }

    isOverdue(): boolean {
        if (!this.todoItem.due) {
            return false;
        }
        return moment(this.todoItem.due) < moment().startOf('day');
    }

    static create(taskData: TaskData): Task {
        const todoItem = new TodoTxtItem(taskData.text, getExtensions());
        todoItem.date = new Date();
        if (taskData.project) {
            todoItem.projects = [taskData.project];
        }
        if (taskData.priority) {
            todoItem.priority = taskData.priority;
        }
        if (taskData.dueDate) {
            todoItem.due = new Date(taskData.dueDate);
            todoItem.dueString = taskData.dueDate;
        }
        return new Task(todoItem);
    }

    update(taskData: TaskData) {
        this.todoItem.text = taskData.text;
        if (taskData.project) {
            this.todoItem.projects = [taskData.project];
        } else {
            this.todoItem.projects = null;
        }
        this.todoItem.priority = taskData.priority;
        if (taskData.dueDate) {
            this.todoItem.due = new Date(taskData.dueDate);
            this.todoItem.dueString = taskData.dueDate;
        } else {
            delete this.todoItem.due;
            delete this.todoItem.dueString;
        }
    }

    toTaskData(): TaskData {
        let project = '';
        if (this.todoItem.projects && this.todoItem.projects.length > 0) {
            project = this.todoItem.projects[0];
        }
        let dueDate = '';
        if (this.todoItem.due) {
            dueDate = dateToString(this.todoItem.due);
        }
        return {
            text: this.todoItem.text,
            project: project,
            priority: this.todoItem.priority,
            dueDate: dueDate,
        };
    }

    toggleComplete() {
        if (!this.todoItem.complete) {
            this.todoItem.complete = true;
            this.todoItem.completed = new Date();
        } else {
            this.todoItem.complete = false;
            this.todoItem.completed = null;
        }
    }

    postpone() {
        if (!this.todoItem.due) {
            return false;
        }
        const newDueDate = new Date(this.todoItem.due);
        newDueDate.setDate(newDueDate.getDate() + 1);
        this.todoItem.due = newDueDate;
        this.todoItem.dueString = dateToString(newDueDate);
        return true;
    }
}
