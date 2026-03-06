import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container" [class.expanded]="isExpanded">
      <button class="toggle-form-btn" (click)="toggleForm()" *ngIf="!isExpanded">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nueva Tarea
      </button>

      <form *ngIf="isExpanded" [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form" @fadeIn>
        <div class="form-header">
          <h3>Crear Nueva Tarea</h3>
          <button type="button" class="btn-close" (click)="toggleForm()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="form-group">
          <label for="taskTitle">Título de la tarea</label>
          <input
            id="taskTitle"
            type="text"
            formControlName="title"
            placeholder="Escribe el título de la tarea..."
            class="form-input"
            [class.error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
          />
          <div class="error-messages" *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
            <span class="error-text" *ngIf="taskForm.get('title')?.errors?.['required']">
              El título es obligatorio
            </span>
            <span class="error-text" *ngIf="taskForm.get('title')?.errors?.['minlength']">
              El título debe tener al menos {{ taskForm.get('title')?.errors?.['minlength']?.requiredLength }} caracteres
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" [disabled]="taskForm.invalid">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Crear Tarea
          </button>
          <button type="button" class="btn-secondary" (click)="toggleForm()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      margin-bottom: 24px;
    }

    .toggle-form-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 16px 24px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15));
      border: 2px dashed rgba(139, 92, 246, 0.3);
      border-radius: 16px;
      color: #c4b5fd;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .toggle-form-btn:hover {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.25));
      border-color: rgba(139, 92, 246, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
    }

    .task-form {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 20px;
      padding: 28px;
      animation: expandIn 0.3s ease-out;
    }

    @keyframes expandIn {
      from {
        opacity: 0;
        transform: translateY(-10px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .form-header h3 {
      font-size: 1.15rem;
      font-weight: 700;
      background: linear-gradient(135deg, #c4b5fd, #67e8f9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .btn-close {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .btn-close:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 8px;
      letter-spacing: 0.02em;
    }

    .form-input {
      width: 100%;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #e2e8f0;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.25);
    }

    .form-input:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
      background: rgba(255, 255, 255, 0.07);
    }

    .form-input.error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .error-messages {
      margin-top: 6px;
    }

    .error-text {
      display: block;
      font-size: 0.8rem;
      color: #f87171;
      margin-top: 4px;
      animation: shakeIn 0.3s ease-out;
    }

    @keyframes shakeIn {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }

    .form-actions {
      display: flex;
      gap: 12px;
    }

    .btn-submit {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.35);
    }

    .btn-submit:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-secondary {
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.9);
    }

    @media (max-width: 640px) {
      .task-form {
        padding: 20px;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn-submit, .btn-secondary {
        justify-content: center;
      }
    }
  `]
})
export class TaskFormComponent {
  @Output() createTask = new EventEmitter<string>();

  taskForm: FormGroup;
  isExpanded = false;

  constructor(private readonly fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  toggleForm(): void {
    this.isExpanded = !this.isExpanded;
    if (!this.isExpanded) {
      this.taskForm.reset();
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const title = this.taskForm.get('title')?.value as string;
      this.createTask.emit(title.trim());
      this.taskForm.reset();
      this.isExpanded = false;
    }
  }
}
