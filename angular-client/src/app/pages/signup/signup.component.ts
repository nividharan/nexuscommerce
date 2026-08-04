import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
      <div style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 440px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">Operator Registration</h2>
          <p style="color: #94a3b8; font-size: 0.85rem;">Register a new profile in the database.</p>
        </div>

        @if (errorMessage()) {
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 10px; border-radius: 6px; font-size: 0.82rem; font-weight: 600; margin-bottom: 1.25rem;">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; color: #cbd5e1; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">Email Address</label>
            <input 
              type="email" 
              formControlName="email"
              placeholder="operator@nexuscommerce.net"
              style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; outline: none;">
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; color: #cbd5e1; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">Password</label>
            <input 
              type="password" 
              formControlName="password"
              placeholder="••••••••"
              style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; outline: none;">
            <span style="font-size: 0.68rem; color: #64748b; margin-top: 4px; display: block;">Must contain at least 6 characters with mixed letters and numbers.</span>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; color: #cbd5e1; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">Confirm Password</label>
            <input 
              type="password" 
              formControlName="confirmPassword"
              placeholder="••••••••"
              style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; outline: none;">
          </div>

          <button 
            type="submit" 
            [disabled]="loadingSignal() || signupForm.invalid"
            style="width: 100%; background: linear-gradient(135deg, #38bdf8, #818cf8); color: #060a13; border: none; padding: 12px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; cursor: pointer;">
            {{ loadingSignal() ? 'Registering...' : 'Create Operator Profile' }}
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.83rem; color: #94a3b8;">
          Already have an account? <a routerLink="/login" style="color: #38bdf8; text-decoration: none; font-weight: 700;">Sign In</a>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loadingSignal = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  public onSubmit(): void {
    if (this.signupForm.invalid) return;

    const { email, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    const hasLetters = /[a-zA-Z]/.test(password || '');
    const hasNumbers = /[0-9]/.test(password || '');
    if (!hasLetters || !hasNumbers) {
      this.errorMessage.set('Password must contain both letters and numbers.');
      return;
    }

    this.loadingSignal.set(true);
    this.errorMessage.set('');

    this.authService.signup(email!, password!).subscribe(res => {
      this.loadingSignal.set(false);
      if (res.success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set(res.message || 'Registration failed.');
      }
    });
  }
}
