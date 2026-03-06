export interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreateTaskPayload {
  title: string;
  completed: boolean;
  userId: number;
}

export interface UpdateTaskPayload {
  title?: string;
  completed?: boolean;
}

export type TaskFilter = 'all' | 'pending' | 'completed';
