import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HillMapComponent } from '../hill-map/hill-map.component';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, HillMapComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50; 
  }

}
