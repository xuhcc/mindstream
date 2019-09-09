import { TodoTxtItem } from 'jstodotxt';

import { TaskData, getExtensions } from './task-data';

describe('TaskData', () => {
    it('should init', () => {
        const formData = {
            text: 'test',
            project: 'testproject',
            priority: 'A',
            dueDate: '2019-01-01',
        };
        const taskData = new TaskData(formData);
        expect(taskData.text).toBe(formData.text);
        expect(taskData.project).toBe(formData.project);
        expect(taskData.priority).toBe(formData.priority);
        expect(taskData.dueDate).toBe(formData.dueDate);
    });

    it('should create task', () => {
        const formData = {
            text: 'test',
            project: 'testproject',
            priority: 'A',
            dueDate: '2019-01-01',
        };
        const taskData = new TaskData(formData);
        const task = taskData.createTodoTxtItem();
        expect(task.text).toEqual('test');
        expect(task.projects).toEqual(['testproject'])
        expect(task.priority).toEqual('A');
        expect(task.due).toEqual(new Date('2019-01-01'));
        expect(task.dueString).toEqual('2019-01-01');
    });

    it('should update task', () => {
        const task = new TodoTxtItem(
            '(A) test +proj due:2019-01-01',
            getExtensions(),
        );
        const formData = {
            text: 'abc',
            project: '',
            priority: 'B',
            dueDate: '',
        };
        const taskData = new TaskData(formData);
        taskData.updateTodoTxtItem(task);
        expect(task.text).toEqual('abc');
        expect(task.projects).toEqual([]);
        expect(task.priority).toEqual('B');
        expect(task.due).toBeUndefined();
        expect(task.dueString).toBeUndefined();
    });
});
