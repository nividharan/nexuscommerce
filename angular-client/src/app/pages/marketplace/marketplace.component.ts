import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main style="max-width: 1240px; margin: 0 auto; padding: 2rem 1.5rem;">
      
      <!-- Hero Banner -->
      <div style="text-align: center; margin-bottom: 2.5rem;">
        <span style="font-size: 0.75rem; font-weight: 700; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.2); display: inline-block; margin-bottom: 0.75rem;">
          ✨ Automated B2B Catalog Platform
        </span>
        <h1 style="font-size: 2.4rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem;">
          B2B Product Catalog <span style="background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Automation</span>
        </h1>
        <p style="color: #94a3b8; font-size: 0.95rem; max-width: 600px; margin: 0 auto;">
          Automate e-commerce product listings with AI vision segmentations, profit margin analytics, and 1-click Shopify exports.
        </p>
      </div>

      <!-- Feedback Toast -->
      @if (toastMessage()) {
        <div style="position: fixed; bottom: 24px; right: 24px; z-index: 1000; background: rgba(16, 185, 129, 0.95); color: #fff; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);">
          {{ toastMessage() }}
        </div>
      }

      <!-- Main Layout: Filter Sidebar + Product Grid -->
      <div style="display: grid; grid-template-columns: 240px 1fr; gap: 2rem; align-items: start;">
        
        <!-- Filter Sidebar Accordion -->
        <aside style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.25rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800; color: #fff; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <span>Filters</span>
            <span (click)="resetFilters()" style="font-size: 0.75rem; color: #38bdf8; font-weight: 600; cursor: pointer;">Reset All</span>
          </h3>

          <!-- Category Filter Accordion -->
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.75rem;">Category</label>
            @for (cat of categories; track cat) {
              <div 
                (click)="activeFilter.set(cat)"
                [style.background]="activeFilter() === cat ? 'rgba(56, 189, 248, 0.15)' : 'transparent'"
                [style.color]="activeFilter() === cat ? '#38bdf8' : '#94a3b8'"
                style="padding: 6px 10px; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; margin-bottom: 4px; transition: background 0.2s;">
                {{ cat }}
              </div>
            }
          </div>

          <!-- Price Range Filter Slider -->
          <div style="margin-bottom: 1.5rem;">
            <label style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.5rem;">
              <span>Max Cost:</span>
              <span style="color: #34d399;">₹{{ maxPriceFilter() }}</span>
            </label>
            <input 
              type="range" 
              min="500" 
              max="25000" 
              step="500" 
              [value]="maxPriceFilter()"
              (input)="updateMaxPrice($event)"
              style="width: 100%; accent-color: #38bdf8; cursor: pointer;">
          </div>

          <!-- In-Stock Filter Checkbox -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="inStockOnly" [(ngModel)]="inStockOnly" style="accent-color: #38bdf8; cursor: pointer;">
            <label for="inStockOnly" style="font-size: 0.8rem; color: #cbd5e1; font-weight: 600; cursor: pointer;">In-Stock Items Only</label>
          </div>
        </aside>

        <!-- Product Grid -->
        <div>
          <!-- Results Counter -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 0.83rem; color: #64748b;">
            <span>Showing <strong style="color: #fff;">{{ filteredProducts().length }}</strong> catalog variations</span>
            <span style="color: #38bdf8; font-weight: 600;">⚡ 60% Margin Calculator Active</span>
          </div>

          <!-- Skeleton Loading State -->
          @if (productService.loadingSignal()) {
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;">
              @for (i of [1,2,3,4]; track i) {
                <div style="background: rgba(15, 23, 42, 0.4); border-radius: 12px; height: 320px; animation: pulse 1.5s infinite; border: 1px solid rgba(255,255,255,0.05);"></div>
              }
            </div>
          } @else {
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;">
              @for (prod of filteredProducts(); track prod.id) {
                <div style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                  
                  <!-- Wishlist Heart Toggle Icon -->
                  <button 
                    (click)="toggleWishlist(prod.id)"
                    [style.color]="wishlistMap()[prod.id] ? '#ef4444' : '#64748b'"
                    style="position: absolute; top: 14px; right: 14px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
                    {{ wishlistMap()[prod.id] ? '♥' : '♡' }}
                  </button>

                  <div>
                    <!-- Category & Stock Urgency Badge -->
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.5rem;">
                      <span style="font-size: 0.7rem; color: #38bdf8; font-weight: 700; text-transform: uppercase;">
                        {{ prod.category }}
                      </span>
                      <span style="font-size: 0.65rem; background: rgba(239, 68, 68, 0.15); color: #f87171; padding: 2px 6px; border-radius: 10px; font-weight: 700;">
                        🔥 Only 4 left
                      </span>
                    </div>

                    <h3 style="font-size: 1.05rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; line-height: 1.3;">
                      {{ prod.title }}
                    </h3>

                    <!-- Review Rating Stars -->
                    <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 0.75rem; font-size: 0.75rem; color: #f59e0b;">
                      <span>★★★★★</span>
                      <span style="color: #94a3b8; font-weight: 600;">4.9 (128)</span>
                    </div>

                    <p style="color: #94a3b8; font-size: 0.82rem; line-height: 1.5; margin-bottom: 1.25rem;">
                      {{ prod.shortDesc }}
                    </p>
                  </div>

                  <div>
                    <!-- Variant Swatches -->
                    <div style="display: flex; gap: 6px; margin-bottom: 1rem;">
                      <span style="width: 14px; height: 14px; border-radius: 50%; background: #38bdf8; display: inline-block; border: 1px solid rgba(255,255,255,0.4);" title="Cyan Slate"></span>
                      <span style="width: 14px; height: 14px; border-radius: 50%; background: #10b981; display: inline-block; border: 1px solid rgba(255,255,255,0.4);" title="Emerald"></span>
                      <span style="width: 14px; height: 14px; border-radius: 50%; background: #6366f1; display: inline-block; border: 1px solid rgba(255,255,255,0.4);" title="Indigo"></span>
                    </div>

                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.85rem; padding-top: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                      <span style="font-size: 0.75rem; color: #64748b;">SKU: {{ prod.sku }}</span>
                      <span style="font-size: 1.2rem; font-weight: 800; color: #34d399;">₹{{ prod.cost * 1.6 | number:'1.2-2' }}</span>
                    </div>

                    <!-- Quick Add CTA -->
                    <div style="display: flex; gap: 0.5rem;">
                      <button 
                        (click)="quickAdd(prod)"
                        style="flex: 1; background: linear-gradient(135deg, #38bdf8, #818cf8); color: #060a13; border: none; padding: 9px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
                        Quick Add
                      </button>

                      <button 
                        (click)="exportShopify(prod)"
                        style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 9px 12px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
                        Shopify
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </main>
  `
})
export class MarketplaceComponent implements OnInit {
  public productService = inject(ProductService);
  public cartService = inject(CartService);
  public authService = inject(AuthService);

  public categories = ['All', 'Apparel', 'Furniture', 'Electronics'];
  public activeFilter = signal<string>('All');
  public maxPriceFilter = signal<number>(25000);
  public inStockOnly = true;
  public toastMessage = signal<string>('');
  public wishlistMap = signal<{ [key: string]: boolean }>({});

  ngOnInit(): void {
    this.productService.getProducts().subscribe();
  }

  public filteredProducts(): Product[] {
    const products = this.productService.productsSignal();
    const filter = this.activeFilter();
    const maxP = this.maxPriceFilter();

    return products.filter(p => {
      const matchCat = filter === 'All' || p.category.toLowerCase().includes(filter.toLowerCase());
      const matchPrice = (p.cost * 1.6) <= maxP;
      return matchCat && matchPrice;
    });
  }

  public updateMaxPrice(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.maxPriceFilter.set(parseInt(val, 10));
  }

  public resetFilters(): void {
    this.activeFilter.set('All');
    this.maxPriceFilter.set(25000);
  }

  public toggleWishlist(prodId: string): void {
    const current = { ...this.wishlistMap() };
    current[prodId] = !current[prodId];
    this.wishlistMap.set(current);
  }

  public quickAdd(prod: Product): void {
    if (!this.authService.tokenSignal()) {
      alert('Please sign in to add items to your queue.');
      return;
    }

    const cartItem = {
      id: prod.id + '_' + Math.random().toString(36).substr(2, 4),
      presetId: prod.id,
      title: prod.title,
      shortDesc: prod.shortDesc,
      category: prod.category,
      price: (prod.cost * 1.6).toFixed(2),
      cost: prod.cost,
      specs: prod.specs,
      sku: prod.sku,
      studioImg: prod.studioImg,
      tags: prod.tags
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      this.showToast(`Added "${prod.title}" to Queue!`);
    });
  }

  public exportShopify(prod: Product): void {
    if (!this.authService.tokenSignal()) {
      alert('Please sign in to export products.');
      return;
    }

    this.cartService.exportToShopify(prod).subscribe(res => {
      this.showToast(res.message || '1-Click Shopify Export Processed!');
    });
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
