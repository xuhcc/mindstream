export enum Settings {
    Path = 'todoFilePath',
    TaskFilter = 'taskFilter',
    TaskOrdering = 'taskOrdering',
}

export interface TaskFilter {
    project?: string;
    context?: string;
    dueDate?: Date;
}
