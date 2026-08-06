import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Interactive ROI Calculator Widget -->
    <section style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(16px); border-top: 1px solid rgba(255, 255, 255, 0.08); border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 3rem 1.5rem; margin-top: 4rem;">
      <div style="max-width: 900px; margin: 0 auto; text-align: center;">
        <span style="font-size: 0.75rem; font-weight: 700; color: #34d399; background: rgba(52, 211, 153, 0.12); padding: 4px 14px; border-radius: 12px; border: 1px solid rgba(52, 211, 153, 0.25); display: inline-block; margin-bottom: 0.75rem;">
          📊 Interactive Commercial ROI Calculator
        </span>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">
          Calculate Your Store's <span style="background: linear-gradient(135deg, #34d399, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Time & Money Savings</span>
        </h2>
        <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 2rem;">
          Drag the slider to see how much automation saves your e-commerce operations per month.
        </p>

        <div style="background: rgba(6, 10, 19, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
          <div style="margin-bottom: 1.5rem;">
            <label style="display: flex; justify-content: space-between; color: #cbd5e1; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.75rem;">
              <span>Monthly Catalog Items Processed:</span>
              <span style="color: #38bdf8; font-size: 1.1rem;">{{ productCount() }} Products</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10" 
              [value]="productCount()" 
              (input)="updateCount($event)"
              style="width: 100%; height: 6px; background: #1e293b; border-radius: 4px; outline: none; cursor: pointer; accent-color: #38bdf8;">
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 1.75rem; text-align: left;">
            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Time Saved / Month</div>
              <div style="font-size: 1.5rem; font-weight: 800; color: #38bdf8; margin-top: 4px;">{{ hoursSaved() }} Hours</div>
            </div>

            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Manual Labor Savings</div>
              <div style="font-size: 1.5rem; font-weight: 800; color: #34d399; margin-top: 4px;">₹{{ moneySaved() | number:'1.0-0' }}</div>
            </div>

            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Shopify Direct Exports</div>
              <div style="font-size: 1.5rem; font-weight: 800; color: #818cf8; margin-top: 4px;">100% Instant</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Commercial Enterprise Footer -->
    <footer style="background: #04070d; border-top: 1px solid rgba(255, 255, 255, 0.06); padding: 3rem 1.5rem 2rem 1.5rem; color: #94a3b8; font-size: 0.85rem;">
      <div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2.5rem; margin-bottom: 2.5rem;">
        
        <!-- Brand & Trust Badges -->
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem;">
            <div style="width: 28px; height: 28px; background: rgba(56, 189, 248, 0.15); border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(56, 189, 248, 0.3);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L17L22 12"/></svg>
            </div>
            <span style="font-weight: 800; color: #fff; font-size: 1rem;">Nivexa SaaS</span>
          </div>

          <p style="font-size: 0.82rem; line-height: 1.6; color: #64748b; margin-bottom: 1.25rem;">
            Enterprise B2B catalog automation platform. Transform supplier notes into live Shopify product catalogs with Nivexa AI profit profiling.
          </p>

          <!-- Live Status Indicator -->
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: #34d399; background: rgba(52, 211, 153, 0.08); padding: 6px 12px; border-radius: 20px; width: fit-content; border: 1px solid rgba(52, 211, 153, 0.2);">
            <span style="width: 8px; height: 8px; background: #34d399; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #34d399;"></span>
            <span>API Server Operational (99.99% Uptime)</span>
          </div>
        </div>

        <!-- Trust & Security -->
        <div>
          <h4 style="color: #fff; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem;">Security & Verification</h4>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            <li style="display: flex; align-items: center; gap: 6px;">🛡️ 256-Bit SSL Encryption</li>
            <li style="display: flex; align-items: center; gap: 6px;">🛍️ Shopify Admin API Verified</li>
            <li style="display: flex; align-items: center; gap: 6px;">💳 PCI-DSS Compliant</li>
            <li style="display: flex; align-items: center; gap: 6px;">🔒 OAuth 2.0 JWT Session</li>
          </ul>
        </div>

        <!-- Solutions -->
        <div>
          <h4 style="color: #fff; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem;">Platform Tools</h4>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            <li>AI Vision Segmentation</li>
            <li>Shopify 1-Click Exporter</li>
            <li>Monaco JSON Editor</li>
            <li>Dynamic Margin Profiler</li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 style="color: #fff; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem;">Legal & Policy</h4>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            <li style="cursor: pointer;">Privacy Policy</li>
            <li style="cursor: pointer;">Terms of Service</li>
            <li style="cursor: pointer;">Developer API Docs</li>
            <li style="cursor: pointer;">Support Desk</li>
          </ul>
        </div>
      </div>

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.5rem; max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: #475569;">
        <div>© 2026 Nivexa Inc. All rights reserved. Enterprise B2B SaaS Edition.</div>
        <div>Built with Angular 18 & Node.js</div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  public productCount = signal<number>(50);

  public updateCount(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.productCount.set(parseInt(val, 10));
  }

  public hoursSaved(): number {
    return Math.round(this.productCount() * 0.45);
  }

  public moneySaved(): number {
    return this.productCount() * 350;
  }
}
