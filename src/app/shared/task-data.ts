import { TodoTxtItem } from 'jstodotxt';
import { TodoTxtExtension, DueExtension } from 'jstodotxt/jsTodoExtensions';

import { dateToString } from '../shared/misc';

export function getExtensions(): TodoTxtExtension[] {
    return [new DueExtension()];
}

export function postponeTask(task: TodoTxtItem) {
    if (!task.due) {
        return;
    }
    const newDueDate = new Date(task.due);
    newDueDate.setDate(newDueDate.getDate() + 1);
    task.due = newDueDate;
    task.dueString = dateToString(task.due);
    return task;
}

export class TaskData {

    text: string;
    project: string;
    priority: string;
    dueDate: string;

    constructor(data: any) {
        this.text = data.text;
        this.project = data.project;
        this.priority = data.priority;
        this.dueDate = data.dueDate;
    }

    static fromTodoTxtItem(task: TodoTxtItem) {
        let project = '';
        if (task.projects && task.projects.length > 0) {
            project = task.projects[0];
        }
        let dueDate = '';
        if (task.due) {
            dueDate = dateToString(task.due);
        }
        return {
            text: task.text,
            project: project,
            priority: task.priority,
            dueDate: dueDate,
        };
    }

    createTodoTxtItem(): TodoTxtItem {
        const task = new TodoTxtItem(this.text, getExtensions());
        task.date = new Date();
        if (this.project) {
            task.projects = [this.project];
        }
        if (this.priority) {
            task.priority = this.priority;
        }
        if (this.dueDate) {
            task.due = new Date(this.dueDate);
            task.dueString = this.dueDate;
        }
        return task;
    }

    updateTodoTxtItem(task: TodoTxtItem): void {
        task.text = this.text;
        if (this.project) {
            task.projects = [this.project];
        } else {
            task.projects = [];
        }
        task.priority = this.priority;
        if (this.dueDate) {
            task.due = new Date(this.dueDate);
            task.dueString = this.dueDate;
        } else {
            delete task.due;
            delete task.dueString;
        }
    }
}
