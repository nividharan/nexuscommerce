import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <nav className="navbar" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 2rem; background: rgba(6, 10, 19, 0.88); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: sticky; top: 0; z-index: 100;">
      
      <!-- Brand Logo -->
      <a routerLink="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
        <div style="width: 36px; height: 36px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
        </div>
        <div>
          <div style="font-weight: 800; font-size: 1.1rem; color: #fff; letter-spacing: -0.5px;">Nivexa</div>
          <div style="font-size: 0.65rem; color: #38bdf8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Catalog Automation</div>
        </div>
      </a>

      <!-- Predictive Search Bar with Auto-Suggest -->
      <div style="position: relative; width: 340px;">
        <div style="position: relative; display: flex; align-items: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style="position: absolute; left: 12px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="onSearchInput()"
            placeholder="Search catalog items, SKUs, categories..." 
            style="width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 8px 12px 8px 36px; border-radius: 20px; font-size: 0.82rem; outline: none; transition: border-color 0.2s;"
            onfocus="this.style.borderColor='#38bdf8'"
            onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'">
        </div>

        <!-- Auto-Suggest Dropdown Results -->
        @if (searchResults().length > 0 && searchQuery.trim()) {
          <div style="position: absolute; top: 42px; left: 0; right: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; z-index: 200;">
            @for (item of searchResults(); track item.id) {
              <div (click)="selectSearchItem(item)" style="padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;" onmouseover="this.style.background='rgba(56,189,248,0.1)'" onmouseout="this.style.background='transparent'">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: #fff;">{{ item.title }}</div>
                  <div style="font-size: 0.72rem; color: #64748b;">{{ item.category }}</div>
                </div>
                <span style="font-size: 0.82rem; font-weight: 800; color: #34d399;">₹{{ item.cost * 1.6 | number:'1.0-0' }}</span>
              </div>
            }
          </div>
        }
      </div>

      <!-- Navigation Links & Shopping Cart Icon -->
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" style="color: #cbd5e1; text-decoration: none; font-size: 0.88rem; font-weight: 600;">Marketplace</a>
        
        <!-- Dynamic Cart Badge Icon -->
        <div style="position: relative; cursor: pointer;" title="Shopping Cart Queue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span style="position: absolute; top: -6px; right: -8px; background: #38bdf8; color: #060a13; font-size: 0.68rem; font-weight: 800; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px rgba(56,189,248,0.6);">
            {{ cartService.cartSignal().length }}
          </span>
        </div>

        <!-- User Profile Session Controls -->
        @if (authService.userSignal()) {
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #818cf8); color: #060a13; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;">
              {{ (authService.userSignal()?.email || 'A').charAt(0).toUpperCase() }}
            </div>
            <button (click)="logout()" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.8rem;">
              Sign Out
            </button>
          </div>
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
  public productService = inject(ProductService);

  public searchQuery = '';
  public searchResults = signal<Product[]>([]);

  public onSearchInput(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.searchResults.set([]);
      return;
    }

    const matches = this.productService.productsSignal().filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q)
    );
    this.searchResults.set(matches.slice(0, 4));
  }

  public selectSearchItem(item: Product): void {
    this.searchQuery = '';
    this.searchResults.set([]);
  }

  public logout(): void {
    this.authService.logout();
  }
}
