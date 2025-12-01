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

  // dynamic src map stores cache-busted URLs for previews
  private dynamicSrc: Record<number, string> = {};
  private refreshIntervalMs = 30 * 60 * 1000; // 30 minutes
  private refreshTimer: any = null;

  constructor() {
    // initialize dynamic sources
    this.cameras.forEach(cam => this.dynamicSrc[cam.id] = this.computeLiveSrc(cam));
    // start periodic refresh
    this.refreshTimer = setInterval(() => this.updateAllSources(), this.refreshIntervalMs);
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

  // Compute a best-effort direct image URL and append a cache-busting timestamp
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
