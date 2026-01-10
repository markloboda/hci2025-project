import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HillMapComponent } from '../hill-map/hill-map.component';
import { hills, Hill } from '../../assets/hills';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, HillMapComponent, FormsModule],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent {
  @ViewChild(HillMapComponent) hillMap!: HillMapComponent;


  hills = hills;

  selectedMountainRange: string = '';
  selectedDifficulty: string = '';
  minHeight: number | null = null;
  maxHeight: number | null = null;

  showFilters = false;
  showMobileList = false;

  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (this.showFilters) this.showMobileList = false; // Close list if opening filters
  }

  toggleList() {
    this.showMobileList = !this.showMobileList;
    if (this.showMobileList) this.showFilters = false; // Close filters if opening list
  }

  get mountainRanges(): string[] {
    const ranges = new Set(this.hills.map(h => h.mountainRange));
    return Array.from(ranges).sort();
  }

  get filteredHills(): Hill[] {
    return this.hills.filter(hill => {
      // 1. Mountain Range
      if (this.selectedMountainRange && hill.mountainRange !== this.selectedMountainRange) {
        return false;
      }

      // 2. Height
      if (this.minHeight !== null && hill.height < this.minHeight) {
        return false;
      }
      if (this.maxHeight !== null && hill.height > this.maxHeight) {
        return false;
      }

      // 3. Difficulty (check if ANY route matches)
      if (this.selectedDifficulty) {
        const hasMatchingRoute = hill.routes.some(r => r.difficulty === this.selectedDifficulty);
        if (!hasMatchingRoute) {
          return false;
        }
      }

      return true;
    });
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
