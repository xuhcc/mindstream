import { TestBed } from '@angular/core/testing'

import { FileService } from './file.service'
import { RouterService } from './router.service'
import { TodoFileService } from './todo-file.service'

describe('TodoFileService', () => {
    let fileContent

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
    }))

    it('should be created', () => {
        const service: TodoFileService = TestBed.get(TodoFileService)
        expect(service).toBeTruthy()
        expect(service.content).toBe('')
        expect(service.fileChanged).toBeDefined()
        // Private property
        expect(service['todoItems']).toEqual([]) // eslint-disable-line dot-notation
    })

    it('should get tasks', async () => {
        const service: TodoFileService = TestBed.get(TodoFileService)
        fileContent = 'task1\ntask2\ntask3'
        await service.load()
        const tasks = service.getTasks()
        expect(tasks.length).toBe(3)
        // IDs are starting with 1
        expect(tasks[0].id).toBe(1)
        expect(tasks[0].text).toBe('task1')
    })

    it('should get projects', async () => {
        const service: TodoFileService = TestBed.get(TodoFileService)
        fileContent = (
            '(A) task1 +project1 +project2\n' +
            'task2 +project3 +project1\n' +
            'x 2019-09-01 task3 +project4\n')
        await service.load()
        const projects = service.getProjects()
        expect(projects).toEqual([
            'project1',
            'project2',
            'project3',
            'project4',
        ])
    })

    it('should get colors', async () => {
        const service: TodoFileService = TestBed.get(TodoFileService)
        fileContent = (
            '(A) task1 color:#cccccc\n' +
            'task2 color:#ffffff\n' +
            'x 2019-09-01 task3 color:#cccccc\n')
        await service.load()
        const colors = service.getColors()
        expect(colors).toEqual(['#cccccc', '#ffffff'])
    })

    it('should remove task', async () => {
        const service: TodoFileService = TestBed.get(TodoFileService)
        fileContent = 'task1\ntask2\ntask3'
        await service.load()
        // Get private property
        const todoItems = service['todoItems'] // eslint-disable-line dot-notation
        expect(todoItems.length).toBe(3)
        await service.removeTask(2)
        expect(todoItems.length).toBe(3)
        expect(todoItems[1]).toBeUndefined()
        expect(service.content).toEqual('task1\ntask3')
    })
})
