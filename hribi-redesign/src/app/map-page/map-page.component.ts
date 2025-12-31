import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HillMapComponent } from '../hill-map/hill-map.component';
import { hills, Hill } from '../../assets/hills';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, HillMapComponent],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent {
  @ViewChild(HillMapComponent) hillMap!: HillMapComponent;

  hills = hills;

  get displayedHills(): Hill[] {
    return this.hills.filter(h => h.height > 2000).slice(0, 8);
  }

  onHillClick(hill: Hill) {
    if (this.hillMap) {
      this.hillMap.flyToHill(hill);
    }
  }

  onLocateMe() {
    // HillMapComponent doesn't have locateMe, but we can fly to a default or just log for now
    console.log('Locate me clicked');
  }
}
