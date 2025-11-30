import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-widget',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-widget.component.html',
  styleUrl: './search-widget.component.css'
})
export class SearchWidgetComponent {
  @Input() mode: 'hero' | 'floating' = 'hero';

  query = "";
  showDropdown = false;

  examples = [
    "Triglav",
    "Mountains above 2000m",
    "Weather at Stol",
    "Live cameras near Kranjska Gora",
    "Mountain ranges in Slovenia",
    "Easy hikes under 2h"
  ];

  onFocus() {
    this.showDropdown = true;
  }

  onBlur() {
    setTimeout(() => this.showDropdown = false, 150);
  }

  onSelectExample(example: string) {
    this.query = example;
    this.showDropdown = false;
  }
}
