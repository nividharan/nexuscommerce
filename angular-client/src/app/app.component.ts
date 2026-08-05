import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { SupportWidgetComponent } from './components/support-widget/support-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent, SupportWidgetComponent],
  template: `
    <div style="min-height: 100vh; background: #060a13; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif;">
      <app-navigation></app-navigation>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
      <app-support-widget></app-support-widget>
    </div>
  `
})
export class AppComponent {
  title = 'NexusCommerce Angular Client';
}
