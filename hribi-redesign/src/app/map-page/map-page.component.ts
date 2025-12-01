import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HillMapPreviewComponent } from '../hill-map/hill-map-preview.component';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, HillMapPreviewComponent],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent {}
