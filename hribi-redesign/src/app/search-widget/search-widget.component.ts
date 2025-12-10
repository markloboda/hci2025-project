import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.css']
})
export class SearchWidgetComponent {
  @Input() mode: 'hero' | 'floating' = 'hero';

  query = "";
  showDropdown = false;

  examples = [
    "Triglav",
    "Gore višje od 2000m",
    "Vreme na Stolu",
    "Kamera v živo pri Kranjski Gori",
    "Gorske verige v Sloveniji",
    "Lahki pohodi pod 2h",
    "Planinske koče v Julijskih Alpah"
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
