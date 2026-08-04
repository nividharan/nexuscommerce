import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: `
    <div style="min-height: 100vh; background: #060a13; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif;">
      <app-navigation></app-navigation>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'NexusCommerce Angular Client';
}
