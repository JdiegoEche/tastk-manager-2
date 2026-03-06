import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, of } from 'rxjs';
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskFilter } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);
  private readonly filterSubject = new BehaviorSubject<TaskFilter>('all');
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly tasks$ = this.tasksSubject.asObservable();
  readonly filter$ = this.filterSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  private nextId = 201;

  readonly filteredTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => {
      const filter = this.filterSubject.getValue();
      switch (filter) {
        case 'pending':
          return tasks.filter(t => !t.completed);
        case 'completed':
          return tasks.filter(t => t.completed);
        default:
          return tasks;
      }
    })
  );

  constructor(private readonly http: HttpClient) { }

  loadTasks(): void {
    this.loadingSubject.next(true);
    this.http.get<Task[]>(this.apiUrl)
      .pipe(
        map(tasks => tasks.slice(0, 20)),
        map(tasks => tasks.map(task => ({
          ...task,
          completed: false
        }))),
        catchError(error => {
          console.error('Error loading tasks:', error);
          return of([]);
        })
      )
      .subscribe(tasks => {
        this.tasksSubject.next(tasks);
        this.loadingSubject.next(false);
      });
  }

  setFilter(filter: TaskFilter): void {
    this.filterSubject.next(filter);
    // Re-emit tasks to trigger filteredTasks$
    this.tasksSubject.next([...this.tasksSubject.getValue()]);
  }

  getFilter(): TaskFilter {
    return this.filterSubject.getValue();
  }

  createTask(payload: CreateTaskPayload): Observable<Task> {
    this.loadingSubject.next(true);
    return this.http.post<Task>(this.apiUrl, payload).pipe(
      map(task => ({
        ...task,
        id: this.nextId++
      })),
      tap(task => {
        const current = this.tasksSubject.getValue();
        this.tasksSubject.next([task, ...current]);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error creating task:', error);
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  updateTask(id: number, payload: UpdateTaskPayload): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, payload).pipe(
      tap(() => {
        const current = this.tasksSubject.getValue();
        const updated = current.map(t =>
          t.id === id ? { ...t, ...payload } : t
        );
        this.tasksSubject.next(updated);
      }),
      catchError(error => {
        console.error('Error updating task:', error);
        throw error;
      })
    );
  }

  toggleComplete(id: number): void {
    const current = this.tasksSubject.getValue();
    const task = current.find(t => t.id === id);
    if (task) {
      this.updateTask(id, { completed: !task.completed }).subscribe();
    }
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.tasksSubject.getValue();
        this.tasksSubject.next(current.filter(t => t.id !== id));
      }),
      catchError(error => {
        console.error('Error deleting task:', error);
        throw error;
      })
    );
  }

  getTaskById(id: number): Task | undefined {
    return this.tasksSubject.getValue().find(t => t.id === id);
  }
}
