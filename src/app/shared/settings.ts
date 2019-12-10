export enum Settings {
    Path = 'todoFilePath',
    TaskFilter = 'taskFiler',
    TaskOrdering = 'taskOrdering',
}

export interface TaskFilter {
    project?: string;
    context?: string;
    dueDate?: Date;
}
