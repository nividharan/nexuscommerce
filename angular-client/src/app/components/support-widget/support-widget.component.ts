import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

@Component({
  selector: 'app-support-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Support Trigger Button -->
    <button 
      (click)="toggleChat()"
      style="position: fixed; bottom: 24px; right: 24px; z-index: 1000; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #818cf8); border: 2px solid rgba(255, 255, 255, 0.2); color: #060a13; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 24px rgba(56, 189, 248, 0.4); transition: transform 0.2s;"
      onmouseover="this.style.transform='scale(1.08)'"
      onmouseout="this.style.transform='scale(1)'">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </button>

    <!-- Support Chat Popover -->
    @if (isOpen()) {
      <div style="position: fixed; bottom: 92px; right: 24px; z-index: 1000; width: 340px; height: 420px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); display: flex; flex-direction: column; overflow: hidden; animation: popIn 0.2s ease-out;">
        
        <!-- Header -->
        <div style="background: rgba(6, 10, 19, 0.9); padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 10px; height: 10px; background: #34d399; border-radius: 50%; box-shadow: 0 0 8px #34d399;"></div>
            <div>
              <div style="font-weight: 800; color: #fff; font-size: 0.9rem;">Nivexa AI Concierge</div>
              <div style="font-size: 0.7rem; color: #34d399;">Live Support • 24/7</div>
            </div>
          </div>
          <button (click)="toggleChat()" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem;">✕</button>
        </div>

        <!-- Chat Messages Body -->
        <div style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;">
          @for (msg of messages(); track $index) {
            <div [style.align-self]="msg.sender === 'user' ? 'flex-end' : 'flex-start'"
                 [style.background]="msg.sender === 'user' ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'rgba(255, 255, 255, 0.06)'"
                 [style.color]="msg.sender === 'user' ? '#060a13' : '#e2e8f0'"
                 style="max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 0.83rem; line-height: 1.4;">
              {{ msg.text }}
            </div>
          }
        </div>

        <!-- Input Box -->
        <form (ngSubmit)="sendMessage()" style="padding: 0.75rem; background: rgba(6, 10, 19, 0.9); border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 8px;">
          <input 
            type="text" 
            [(ngModel)]="userInput"
            name="userInput"
            placeholder="Ask about Shopify export or API..." 
            style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; outline: none;">
          <button type="submit" style="background: #38bdf8; color: #060a13; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
            Send
          </button>
        </form>
      </div>
    }
  `
})
export class SupportWidgetComponent {
  public isOpen = signal<boolean>(false);
  public userInput = '';

  public messages = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: '👋 Hello! I am the Nivexa AI Assistant. How can I help with your store catalog automation today?',
      time: 'Now'
    }
  ]);

  public toggleChat(): void {
    this.isOpen.set(!this.isOpen());
  }

  public sendMessage(): void {
    if (!this.userInput.trim()) return;

    const text = this.userInput;
    this.userInput = '';

    // Add user message
    this.messages.update(msgs => [...msgs, { sender: 'user', text, time: 'Now' }]);

    // Simulated Bot AI Response
    setTimeout(() => {
      let reply = 'NexusCommerce automates product catalog creation and 1-click Shopify exports directly to your store.';
      const lower = text.toLowerCase();

      if (lower.includes('shopify')) {
        reply = '🛍️ To connect Shopify, go to Account Settings and enter your Store Domain & Admin Access Token (shpat_...). Then click "Shopify" on any product!';
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
        reply = '✨ Platform access is 100% unlocked for all registered operators with unlimited catalog exports!';
      } else if (lower.includes('api') || lower.includes('developer')) {
        reply = '⚡ REST API endpoints are active at https://nexuscommerce-1.onrender.com/api with JWT authentication.';
      }

      this.messages.update(msgs => [...msgs, { sender: 'bot', text: reply, time: 'Now' }]);
    }, 600);
  }
}
