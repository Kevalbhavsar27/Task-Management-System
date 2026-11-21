export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export interface User { id: string; username: string; email: string }
export interface Task { id: string; title: string; description: string; status: TaskStatus; createdAt: string; updatedAt: string }
