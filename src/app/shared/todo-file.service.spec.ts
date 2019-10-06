import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';
import { RouterService } from './router.service';
import { TodoFileService } from './todo-file.service';

describe('TodoFileService', () => {
    let fileContent;

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {
                provide: FileService,
                useValue: {
                    read: () => fileContent,
                    write: () => {},
                },
            },
            {provide: RouterService, useValue: {}},
        ],
    }));

    it('should be created', () => {
        const service: TodoFileService = TestBed.get(TodoFileService);
        expect(service).toBeTruthy();
        expect(service.content).toBe('');
        expect(service.todoItems).toEqual([]);
        expect(service.fileChanged).toBeDefined();
        expect(service.watcher).toBeDefined();
    });

    it('shold get projects', async () => {
        const service: TodoFileService = TestBed.get(TodoFileService);
        fileContent = (
            '(A) task1 +project1 +project2\n' +
            'task2 +project3 +project1\n' +
            'x 2019-09-01 task3 +project4\n');
        await service.load();
        const projects = service.getProjects();
        expect(projects).toEqual([
            'project1',
            'project2',
            'project3',
            'project4',
        ]);
    });

    it('should remove task', async () => {
        const service: TodoFileService = TestBed.get(TodoFileService);
        fileContent = 'task1\ntask2\ntask3';
        await service.load();
        expect(service.todoItems.length).toBe(3);
        service.removeTask(1);
        expect(service.todoItems.length).toBe(3);
        expect(service.todoItems[1]).toBeUndefined();
        expect(service.content).toEqual('task1\ntask3');
    });
});
