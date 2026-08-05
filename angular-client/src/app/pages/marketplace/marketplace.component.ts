import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem;">
      <!-- Hero Banner -->
      <div style="text-align: center; margin-bottom: 3rem;">
        <span style="font-size: 0.75rem; font-weight: 700; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.2); display: inline-block; margin-bottom: 0.75rem;">
          ✨ Automated B2B Catalog Platform
        </span>
        <h1 style="font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem;">
          B2B Product Catalog <span style="background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Automation</span>
        </h1>
        <p style="color: #94a3b8; font-size: 1rem; max-width: 600px; margin: 0 auto;">
          Automate your e-commerce product listings with AI vision segmentations, profit margin analytics, and 1-click Shopify exports.
        </p>

        <!-- Category Filters -->
        <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem;">
          @for (cat of categories; track cat) {
            <button 
              (click)="activeFilter.set(cat)"
              [style.background]="activeFilter() === cat ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'rgba(15, 23, 42, 0.6)'"
              [style.color]="activeFilter() === cat ? '#060a13' : '#cbd5e1'"
              style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;">
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <!-- Feedback Toast -->
      @if (toastMessage()) {
        <div style="position: fixed; bottom: 24px; right: 24px; z-index: 1000; background: rgba(16, 185, 129, 0.95); color: #fff; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);">
          {{ toastMessage() }}
        </div>
      }

      <!-- Products Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.75rem;">
        @for (prod of filteredProducts(); track prod.id) {
          <div style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 0.72rem; color: #38bdf8; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;">
                {{ prod.category }}
              </div>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; line-height: 1.3;">
                {{ prod.title }}
              </h3>
              <p style="color: #94a3b8; font-size: 0.83rem; line-height: 1.5; margin-bottom: 1.25rem;">
                {{ prod.shortDesc }}
              </p>
            </div>

            <div>
              <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                <span style="font-size: 0.75rem; color: #64748b;">SKU: {{ prod.sku }}</span>
                <span style="font-size: 1.25rem; font-weight: 800; color: #34d399;">₹{{ prod.cost * 1.6 | number:'1.2-2' }}</span>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <button 
                  (click)="quickAdd(prod)"
                  style="flex: 1; background: linear-gradient(135deg, #38bdf8, #818cf8); color: #060a13; border: none; padding: 10px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
                  Add to Queue
                </button>

                <button 
                  (click)="exportShopify(prod)"
                  style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 10px 14px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
                  Shopify
                </button>
              </div>
            </div>
          </div>
        }
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
  public toastMessage = signal<string>('');

  ngOnInit(): void {
    this.productService.getProducts().subscribe();
  }

  public filteredProducts(): Product[] {
    const products = this.productService.productsSignal();
    const filter = this.activeFilter();
    if (filter === 'All') return products;
    return products.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));
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
