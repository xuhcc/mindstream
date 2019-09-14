export enum Settings {
    Path = 'todoFilePath',
    TaskFilter = 'taskFiler',
}

export interface TaskFilter {
    project?: string;
    dueDate?: Date;
}
