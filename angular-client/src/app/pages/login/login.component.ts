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
        
        <div style="text-align: center; margin-bottom: 1.75rem;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">Operator Login</h2>
          <p style="color: #94a3b8; font-size: 0.85rem;">Sign in to access your B2B catalog workspace.</p>
        </div>

        <!-- Quick Demo Credentials Banner -->
        <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); padding: 10px 14px; border-radius: 8px; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 1.25rem;">
          <div style="font-weight: 700; color: #38bdf8; margin-bottom: 2px;">🔑 Official Admin Credentials:</div>
          <div>Email: <code style="color: #34d399;">admin&#64;nexuscommerce.com</code></div>
          <div>Password: <code style="color: #34d399;">Password123</code></div>
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
              placeholder="admin@nexuscommerce.com"
              style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; outline: none;">
          </div>

          <div style="margin-bottom: 1.5rem; position: relative;">
            <label style="display: block; color: #cbd5e1; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">Password</label>
            <div style="position: relative;">
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                formControlName="password"
                placeholder="••••••••"
                style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 42px 10px 14px; border-radius: 8px; font-size: 0.9rem; outline: none;">
              
              <!-- Show / Hide Eye Toggle Icon -->
              <button 
                type="button" 
                (click)="toggleShowPassword()" 
                style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px; display: flex; align-items: center;">
                @if (showPassword()) {
                  <!-- Eye Off Icon -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                } @else {
                  <!-- Eye Open Icon -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
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
  public showPassword = signal<boolean>(false);

  public loginForm = this.fb.group({
    email: ['admin@nexuscommerce.com', [Validators.required, Validators.email]],
    password: ['Password123', [Validators.required, Validators.minLength(6)]]
  });

  public toggleShowPassword(): void {
    this.showPassword.set(!this.showPassword());
  }

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
