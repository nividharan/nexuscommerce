import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
      <div style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 420px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">Operator Login</h2>
          <p style="color: #94a3b8; font-size: 0.85rem;">Sign in to access your Angular B2B catalog workspace.</p>
        </div>

        @if (errorMessage()) {
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 10px; border-radius: 6px; font-size: 0.82rem; font-weight: 600; margin-bottom: 1.25rem;">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; color: #cbd5e1; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">Email Address</label>
            <input 
              type="email" 
              formControlName="email"
              placeholder="operator@nexuscommerce.net"
              style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; outline: none;">
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; color: #cbd5e1; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">Password</label>
            <input 
              type="password" 
              formControlName="password"
              placeholder="••••••••"
              style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; outline: none;">
          </div>

          <button 
            type="submit" 
            [disabled]="loadingSignal() || loginForm.invalid"
            style="width: 100%; background: linear-gradient(135deg, #38bdf8, #818cf8); color: #060a13; border: none; padding: 12px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; cursor: pointer;">
            {{ loadingSignal() ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.83rem; color: #94a3b8;">
          New operator? <a routerLink="/signup" style="color: #38bdf8; text-decoration: none; font-weight: 700;">Create an Account</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loadingSignal = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loadingSignal.set(true);
    this.errorMessage.set('');

    this.authService.login(email!, password!).subscribe(res => {
      this.loadingSignal.set(false);
      if (res.success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set(res.message || 'Invalid email or password.');
      }
    });
  }
}
