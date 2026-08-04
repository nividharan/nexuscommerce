import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav className="navbar" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: rgba(6, 10, 19, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: sticky; top: 0; z-index: 100;">
      <!-- Logo -->
      <a routerLink="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
        <div style="width: 34px; height: 34px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
        </div>
        <div>
          <div style="font-weight: 800; font-size: 1.1rem; color: #fff; letter-spacing: -0.5px;">NexusCommerce</div>
          <div style="font-size: 0.65rem; color: #38bdf8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Angular Pipeline</div>
        </div>
      </a>

      <!-- Navigation Links -->
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" style="color: var(--text-secondary, #94a3b8); text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: color 0.2s;">Marketplace</a>
        
        <!-- User Session Controls -->
        @if (authService.userSignal()) {
          <span style="font-size: 0.82rem; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.2);">
            {{ authService.userSignal()?.email }}
          </span>
          <button (click)="logout()" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.8rem;">
            Sign Out
          </button>
        } @else {
          <a routerLink="/login" style="color: #cbd5e1; text-decoration: none; font-size: 0.88rem; font-weight: 600;">Sign In</a>
          <a routerLink="/signup" style="background: linear-gradient(135deg, #38bdf8, #818cf8); color: #060a13; padding: 7px 16px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 0.85rem;">Get Started</a>
        }
      </div>
    </nav>
  `
})
export class NavigationComponent {
  public authService = inject(AuthService);
  public cartService = inject(CartService);

  logout() {
    this.authService.logout();
  }
}
