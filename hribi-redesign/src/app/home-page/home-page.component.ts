import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HillMapComponent } from '../hill-map/hill-map.component';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, HillMapComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
