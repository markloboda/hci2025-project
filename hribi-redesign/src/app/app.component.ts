import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { RouteName } from '../models/enums';
import { CommonModule } from '@angular/common';
import { SearchWidgetComponent } from './search-widget/search-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SearchWidgetComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hribi-redesign';
  // expose the RouteName enum value for the template
  readonly routeHome = RouteName.home;
  scrolled = false;
  showSearch = false;
  // router injection for programmatic navigation (used by goHome)
  private router = inject(Router);
  // darkMode = false;
  isMenuOpen = false;

  ngOnInit(): void {
    console.log('AppComponent initialized');
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationStart) {
        console.log('NavigationStart ->', e.url);
      } else if (e instanceof NavigationEnd) {
        this.isMenuOpen = false;
        console.log('NavigationEnd ->', e.url);
      } else if (e instanceof NavigationError) {
        console.error('NavigationError ->', e.error);
      } else {
        // generic log for other router events
        // console.log('Router event', e);
      }
    });

    // initialize theme from localStorage or prefer dark-media
    // try {
    //   const saved = localStorage.getItem('hribi:darkMode');
    //   if (saved !== null) {
    //     this.darkMode = saved === '1';
    //   } else {
    //     this.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    //   }
    // } catch (e) {
    //   this.darkMode = false;
    // }
    // this.applyTheme();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Backwards-compatible handler in case templates call (click)="goHome($event)"
  goHome(e?: Event) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.router.navigate(['/home']);
  }

  // toggleTheme() {
  //   this.darkMode = !this.darkMode;
  //   try {
  //     localStorage.setItem('hribi:darkMode', this.darkMode ? '1' : '0');
  //   } catch (e) {
  //     // ignore storage errors
  //   }
  //   this.applyTheme();
  // }

  // private applyTheme() {
  //   if (typeof document !== 'undefined') {
  //     if (this.darkMode) {
  //       document.documentElement.classList.add('dark-theme');
  //     } else {
  //       document.documentElement.classList.remove('dark-theme');
  //     }
  //   }
  // }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const viewportHeight = window.innerHeight;
    const isHome = this.router.url === '/home' || this.router.url === '/';
    if (isHome) {
      this.showSearch = window.scrollY > (viewportHeight * 0.3);
    } else {
      this.showSearch = false;
    }
  }
}
