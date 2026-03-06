import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Task, TaskFilter } from '../../../core/models/task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, TaskFormComponent, TaskFilterComponent, ConfirmDialogComponent],
  template: `
    <div class="tasks-page">
      <header class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Task Manager</h1>
            <p class="page-subtitle">Organiza y gestiona tus tareas de forma eficiente</p>
          </div>
        </div>
        <div class="stats" *ngIf="tasks$ | async as tasks">
          <div class="stat-item">
            <span class="stat-number">{{ tasks.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item stat-completed">
            <span class="stat-number">{{ getCompletedCount(tasks) }}</span>
            <span class="stat-label">Completadas</span>
          </div>
          <div class="stat-item stat-pending">
            <span class="stat-number">{{ getPendingCount(tasks) }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
        </div>
      </header>

      <app-task-form (createTask)="onCreateTask($event)"></app-task-form>

      <app-task-filter
        [currentFilter]="currentFilter"
        (filterChange)="onFilterChange($event)"
      ></app-task-filter>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading$ | async">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Cargando tareas...</p>
      </div>

      <!-- Task List -->
      <div class="task-list" *ngIf="!(loading$ | async)">
        <ng-container *ngIf="filteredTasks$ | async as tasks">
          <div class="empty-state" *ngIf="tasks.length === 0">
            <div class="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>No hay tareas</h3>
            <p>Crea una nueva tarea o cambia el filtro</p>
          </div>

          <app-task-item
            *ngFor="let task of tasks; trackBy: trackByTaskId"
            [task]="task"
            (toggle)="onToggle($event)"
            (edit)="onEdit($event)"
            (delete)="onDelete($event)"
          ></app-task-item>
        </ng-container>
      </div>

      <app-confirm-dialog
        [isOpen]="showDeleteConfirm"
        title="Eliminar tarea"
        message="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
        (confirmed)="confirmDelete()"
        (cancelled)="cancelDelete()"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .tasks-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff, #c4b5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.4);
      margin: 4px 0 0;
    }

    .stats {
      display: flex;
      gap: 12px;
    }

    .stat-item {
      flex: 1;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 16px 20px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-2px);
    }

    .stat-number {
      display: block;
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #c4b5fd, #67e8f9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-completed .stat-number {
      background: linear-gradient(135deg, #4ade80, #22d3ee);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .stat-pending .stat-number {
      background: linear-gradient(135deg, #fbbf24, #f97316);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .stat-label {
      display: block;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
      margin-top: 4px;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
    }

    .loading-spinner {
      position: relative;
      width: 60px;
      height: 60px;
    }

    .spinner-ring {
      position: absolute;
      inset: 0;
      border: 3px solid transparent;
      border-radius: 50%;
      animation: spin 1.2s linear infinite;
    }

    .spinner-ring:nth-child(1) {
      border-top-color: #8b5cf6;
      animation-delay: -0.3s;
    }

    .spinner-ring:nth-child(2) {
      inset: 6px;
      border-right-color: #06b6d4;
      animation-delay: -0.15s;
      animation-direction: reverse;
    }

    .spinner-ring:nth-child(3) {
      inset: 12px;
      border-bottom-color: #c4b5fd;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      margin-top: 20px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: rgba(255, 255, 255, 0.3);
    }

    .empty-icon {
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .empty-state h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      margin: 0 0 8px;
    }

    .empty-state p {
      font-size: 0.9rem;
      margin: 0;
    }

    @media (max-width: 640px) {
      .tasks-page {
        padding: 24px 16px;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .stats {
        flex-direction: row;
        gap: 8px;
      }

      .stat-item {
        padding: 12px;
      }

      .stat-number {
        font-size: 1.4rem;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;
  loading$: Observable<boolean>;
  currentFilter: TaskFilter = 'all';
  showDeleteConfirm = false;
  private taskToDeleteId: number | null = null;

  constructor(private readonly taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
    this.filteredTasks$ = this.taskService.filteredTasks$;
    this.loading$ = this.taskService.loading$;
  }

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  onCreateTask(title: string): void {
    this.taskService.createTask({
      title,
      completed: false,
      userId: 1
    }).subscribe();
  }

  onToggle(id: number): void {
    this.taskService.toggleComplete(id);
  }

  onEdit(event: { id: number; title: string }): void {
    this.taskService.updateTask(event.id, { title: event.title }).subscribe();
  }

  onDelete(id: number): void {
    this.taskToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.taskToDeleteId !== null) {
      this.taskService.deleteTask(this.taskToDeleteId).subscribe();
    }
    this.showDeleteConfirm = false;
    this.taskToDeleteId = null;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.taskToDeleteId = null;
  }

  onFilterChange(filter: TaskFilter): void {
    this.currentFilter = filter;
    this.taskService.setFilter(filter);
  }

  getCompletedCount(tasks: Task[]): number {
    return tasks.filter(t => t.completed).length;
  }

  getPendingCount(tasks: Task[]): number {
    return tasks.filter(t => !t.completed).length;
  }

  trackByTaskId(_index: number, task: Task): number {
    return task.id;
  }
}
