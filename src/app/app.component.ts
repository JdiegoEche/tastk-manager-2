import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer">
        <p>Task Manager &copy; 2026 — Built with Angular</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .bg-gradient {
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .bg-grid {
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 0;
    }

    .main-content {
      position: relative;
      z-index: 1;
      flex: 1;
    }

    .app-footer {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 24px;
      color: rgba(255, 255, 255, 0.2);
      font-size: 0.8rem;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
    }

    .app-footer p {
      margin: 0;
    }
  `]
})
export class AppComponent { }
