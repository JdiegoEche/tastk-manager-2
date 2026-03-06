import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilter } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-bar">
      <button
        class="filter-btn"
        [class.active]="currentFilter === 'all'"
        (click)="onFilterChange('all')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        Todas
      </button>
      <button
        class="filter-btn"
        [class.active]="currentFilter === 'pending'"
        (click)="onFilterChange('pending')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Pendientes
      </button>
      <button
        class="filter-btn"
        [class.active]="currentFilter === 'completed'"
        (click)="onFilterChange('completed')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        Completadas
      </button>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      gap: 8px;
      padding: 6px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      margin-bottom: 20px;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      justify-content: center;
      padding: 10px 16px;
      background: transparent;
      border: none;
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .filter-btn:hover {
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.05);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
      color: #c4b5fd;
      box-shadow: 0 2px 10px rgba(139, 92, 246, 0.15);
    }

    @media (max-width: 480px) {
      .filter-btn span {
        display: none;
      }

      .filter-btn {
        padding: 10px 12px;
      }
    }
  `]
})
export class TaskFilterComponent {
  @Input() currentFilter: TaskFilter = 'all';
  @Output() filterChange = new EventEmitter<TaskFilter>();

  onFilterChange(filter: TaskFilter): void {
    this.filterChange.emit(filter);
  }
}
