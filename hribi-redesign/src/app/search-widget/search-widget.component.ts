import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { hills } from '../../assets/hills';

@Component({
  selector: 'app-search-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.css']
})
export class SearchWidgetComponent {
  private router = inject(Router);
  @Input() mode: 'hero' | 'floating' = 'hero';

  query = "";
  showDropdown = false;

  examples = [
    "Triglav",
    "Stol",
    "Grintovec",
    "Snežnik"
  ];

  get filteredHills() {
    if (!this.query.trim()) {
      return this.examples;
    }
    const q = this.query.toLowerCase();
    const hillResults = hills
      .filter(h => h.name.toLowerCase().includes(q))
      .map(h => h.name);

    // Combine with examples that might match or just show hills
    if (hillResults.length > 0) {
      return hillResults.slice(0, 10); // Limit results
    }

    return this.examples.filter(e => e.toLowerCase().includes(q));
  }

  onFocus() {
    this.showDropdown = true;
  }

  onBlur() {
    setTimeout(() => this.showDropdown = false, 150);
  }

  onSelectValue(value: string) {
    this.query = value;
    this.showDropdown = false;
    this.navigateToHill(value);
  }

  onSearch() {
    if (this.query.trim()) {
      this.navigateToHill(this.query);
    }
  }

  private navigateToHill(name: string) {
    const hill = hills.find(h => h.name.toLowerCase() === name.toLowerCase());
    if (hill) {
      this.router.navigate(['/hill', hill.id]);
    } else {
      // If no exact match, maybe navigate to first result from filtered list
      const firstMatch = hills.find(h => h.name.toLowerCase().includes(name.toLowerCase()));
      if (firstMatch) {
        this.router.navigate(['/hill', firstMatch.id]);
      }
    }
  }
}
