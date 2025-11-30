import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchWidgetComponent } from './search-widget/search-widget.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SearchWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hribi-redesign';
  scrolled = false;
  showSearch = false;
  private readonly SHOW_SEARCH_AFTER = 400;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50; 
    this.showSearch = window.scrollY > this.SHOW_SEARCH_AFTER;
  }
}
