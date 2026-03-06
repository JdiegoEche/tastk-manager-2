import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-card" [class.completed]="task.completed" [class.editing]="isEditing">
      <div class="task-content">
        <div class="task-checkbox" (click)="onToggle()">
          <div class="checkbox" [class.checked]="task.completed">
            <svg *ngIf="task.completed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        <div class="task-info" *ngIf="!isEditing">
          <span class="task-id">#{{ task.id }}</span>
          <h3 class="task-title" [class.done]="task.completed">{{ task.title }}</h3>
          <span class="task-status" [class.status-completed]="task.completed" [class.status-pending]="!task.completed">
            {{ task.completed ? 'Completada' : 'Pendiente' }}
          </span>
        </div>
        <div class="task-edit-form" *ngIf="isEditing">
          <input
            #editInput
            type="text"
            class="edit-input"
            [value]="task.title"
            (keyup.enter)="onSaveEdit(editInput.value)"
            (keyup.escape)="onCancelEdit()"
          />
          <div class="edit-actions">
            <button class="btn-save" (click)="onSaveEdit(editInput.value)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Guardar
            </button>
            <button class="btn-cancel" (click)="onCancelEdit()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <div class="task-actions" *ngIf="!isEditing">
        <button class="btn-icon btn-edit" (click)="onEdit()" title="Editar tarea">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="btn-icon btn-delete" (click)="onDelete()" title="Eliminar tarea">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .task-card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(139, 92, 246, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    .task-card.completed {
      opacity: 0.7;
    }

    .task-card.completed:hover {
      opacity: 0.9;
    }

    .task-content {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 0;
    }

    .task-checkbox {
      cursor: pointer;
      flex-shrink: 0;
    }

    .checkbox {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      color: transparent;
    }

    .checkbox:hover {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.1);
    }

    .checkbox.checked {
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      border-color: transparent;
      color: white;
    }

    .checkbox svg {
      width: 14px;
      height: 14px;
    }

    .task-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
      flex-wrap: wrap;
    }

    .task-id {
      font-size: 0.75rem;
      font-weight: 600;
      color: rgba(139, 92, 246, 0.7);
      background: rgba(139, 92, 246, 0.1);
      padding: 2px 8px;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .task-title {
      font-size: 0.95rem;
      font-weight: 500;
      color: #e2e8f0;
      margin: 0;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .task-title.done {
      text-decoration: line-through;
      color: rgba(226, 232, 240, 0.4);
    }

    .task-status {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 20px;
      flex-shrink: 0;
    }

    .status-completed {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    .status-pending {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }

    .task-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      margin-left: 12px;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.5);
    }

    .btn-icon:hover {
      transform: scale(1.1);
    }

    .btn-edit:hover {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }

    .btn-delete:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    .task-edit-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .edit-input {
      width: 100%;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.4);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s ease;
    }

    .edit-input:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
    }

    .edit-actions {
      display: flex;
      gap: 8px;
    }

    .btn-save, .btn-cancel {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-save {
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      color: white;
    }

    .btn-save:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }

    .btn-cancel {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.6);
    }

    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
    }

    @media (max-width: 640px) {
      .task-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 16px;
      }

      .task-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .task-actions {
        margin-left: 0;
        align-self: flex-end;
      }
    }
  `]
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggle = new EventEmitter<number>();
  @Output() edit = new EventEmitter<{ id: number; title: string }>();
  @Output() delete = new EventEmitter<number>();

  isEditing = false;

  onToggle(): void {
    this.toggle.emit(this.task.id);
  }

  onEdit(): void {
    this.isEditing = true;
  }

  onSaveEdit(newTitle: string): void {
    const trimmed = newTitle.trim();
    if (trimmed && trimmed !== this.task.title) {
      this.edit.emit({ id: this.task.id, title: trimmed });
    }
    this.isEditing = false;
  }

  onCancelEdit(): void {
    this.isEditing = false;
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }
}
