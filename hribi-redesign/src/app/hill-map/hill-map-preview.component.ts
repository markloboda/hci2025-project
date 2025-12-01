import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HillMapComponent } from './hill-map.component';

@Component({
  selector: 'app-hill-map-preview',
  standalone: true,
  imports: [CommonModule, HillMapComponent],
  template: `<app-hill-map [showPlaceholder]="false"></app-hill-map>`,
})
export class HillMapPreviewComponent {}
