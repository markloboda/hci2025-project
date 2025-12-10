import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HillMapPreviewComponent } from '../hill-map/hill-map-preview.component';
import { SearchWidgetComponent } from '../search-widget/search-widget.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HillMapPreviewComponent, SearchWidgetComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const viewportHeight = window.innerHeight;
    this.scrolled = window.scrollY > (viewportHeight * 0.1);
  }

  ngOnInit() {
    console.log('HomePageComponent loaded');
  }

}
