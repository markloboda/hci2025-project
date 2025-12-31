import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cameras, Camera } from '../../assets/cameras';

@Component({
  selector: 'app-cameras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent {
  cameras: Camera[] = cameras;

  searchTerm: string = '';

  // Get filtered cameras based on search term
  get filteredCameras(): Camera[] {
    if (!this.searchTerm) {
      return this.cameras;
    }
    const term = this.searchTerm.toLowerCase();
    return this.cameras.filter(cam =>
      cam.name.toLowerCase().includes(term) ||
      (cam.location && cam.location.toLowerCase().includes(term))
    );
  }

  // popular cameras (e.g. Triglav, Bled, etc from the list)
  // Hardcoded IDs or names for demo
  get popularCameras(): Camera[] {
    // Let's pick some well‑known peaks for demo purposes
    const popularNames = ['Triglav', 'Vršič', 'Kranjska Gora'];
    return this.cameras.filter(c => popularNames.some(p => c.name.includes(p)));
  }

  // Rest of the list (excluding popular if search is empty, or all if search is active)
  get otherCameras(): Camera[] {
    if (this.searchTerm) return this.filteredCameras; // If searching, just show results in the main grid

    const popularIds = new Set(this.popularCameras.map(c => c.id));
    return this.cameras.filter(c => !popularIds.has(c.id));
  }

  updateSearch(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  // dynamic src map stores cache‑busted URLs for previews
  private dynamicSrc: Record<number, string> = {};
  private refreshIntervalMs = 30 * 60 * 1000; // 30 minutes
  private refreshTimer: any = null;

  constructor() {
    // initialize dynamic sources
    this.cameras.forEach(cam => this.dynamicSrc[cam.id] = this.computeLiveSrc(cam));
    // start periodic refresh
    this.refreshTimer = setInterval(() => this.updateAllSources(), this.refreshIntervalMs);
    console.log('Cameras component initialized'); // Trigger rebuild
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  open(url: string) {
    window.open(url, '_blank', 'noopener');
  }

  // Public getter used by template to obtain the current src (with timestamp)
  getLiveSrc(cam: Camera): string {
    return this.dynamicSrc[cam.id] || this.computeLiveSrc(cam);
  }

  private updateAllSources() {
    this.cameras.forEach(cam => {
      this.dynamicSrc[cam.id] = this.computeLiveSrc(cam);
    });
  }

  // Compute a best‑effort direct image URL and append a cache‑busting timestamp
  private computeLiveSrc(cam: Camera): string {
    try {
      const url = cam.url || '';
      // If URL contains the image.html wrapper, extract the path after '?'
      if (url.includes('image.html?')) {
        const parts = url.split('image.html?');
        const origin = new URL(url).origin;
        const direct = origin + parts[1];
        return this.appendTimestamp(direct);
      }
      return this.appendTimestamp(url);
    } catch (err) {
      return cam.url;
    }
  }

  private appendTimestamp(u: string): string {
    if (!u) return u;
    const sep = u.includes('?') ? '&' : '?';
    return `${u}${sep}_=${Date.now()}`;
  }
}
