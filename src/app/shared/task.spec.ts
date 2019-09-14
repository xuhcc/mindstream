import { TodoTxtItem } from 'jstodotxt';

import { Task, getExtensions } from './task';

describe('TaskData', () => {
    it('should init', () => {
        const todoItem = new TodoTxtItem(
            '(A) test +proj due:2019-01-01',
            getExtensions(),
        );
        const task = new Task(todoItem);
        expect(task.todoItem).toBe(todoItem);
    });

    it('should create task', () => {
        const formData = {
            text: 'test',
            project: 'testproject',
            priority: 'A',
            dueDate: '2019-01-01',
            recurrence: '1w',
        };
        const task = Task.create(formData);
        expect(task.todoItem.text).toEqual('test');
        expect(task.todoItem.projects).toEqual(['testproject']);
        expect(task.todoItem.priority).toEqual('A');
        expect(task.todoItem.due).toEqual(new Date('2019-01-01'));
        expect(task.todoItem.dueString).toEqual('2019-01-01');
        expect(task.todoItem.rec).toEqual('1w');
        expect(task.todoItem.recString).toEqual('1w');
    });

    it('should update task', () => {
        const task = new Task(new TodoTxtItem(
            '(A) test +proj due:2019-01-01',
            getExtensions(),
        ));
        const formData = {
            text: 'abc',
            project: '',
            priority: 'B',
            dueDate: '',
            recurrence: '',
        };
        task.update(formData);
        expect(task.todoItem.text).toEqual('abc');
        expect(task.todoItem.projects).toBe(null);
        expect(task.todoItem.priority).toEqual('B');
        expect(task.todoItem.due).toBeUndefined();
        expect(task.todoItem.dueString).toBeUndefined();
        expect(task.todoItem.rec).toBeUndefined();
        expect(task.todoItem.recString).toBeUndefined();
    });
});
