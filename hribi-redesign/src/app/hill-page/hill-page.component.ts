import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Hill, hills } from '../../assets/hills';
import { WeatherService } from '../services/weather.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-hill-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hill-page.component.html',
  styleUrls: ['./hill-page.component.css']
})
export class HillPageComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private weatherService = inject(WeatherService);

  hillID!: number;
  hillData: Hill | undefined;
  weatherForecast: any[] = [];
  currentWeather: any = null;
  expandedRoutes: boolean[] = [];
  selectedRouteIndex: number | null = null;
  selectedImage: any = null;

  private map: L.Map | undefined;
  private hillMarker: L.Marker | undefined;
  private routeLayer: L.Polyline | undefined;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hillID = +params['id'];
      this.loadHillData();
      this.loadWeatherData();
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  loadHillData() {
    this.hillData = hills.find(hill => hill.id === this.hillID);
    // Initialize expanded routes array
    if (this.hillData) {
      this.expandedRoutes = new Array(this.hillData.routes.length).fill(false);
    }
  }

  toggleRoute(index: number): void {
    this.expandedRoutes[index] = !this.expandedRoutes[index];
  }

  async loadWeatherData() {
    if (this.hillData) {
      try {
        const currentWeather = await this.weatherService.getCurrentWeather(
          this.hillData.lat,
          this.hillData.lon
        );

        if (currentWeather) {
          this.currentWeather = {
            temp: Math.round(currentWeather.main.temp),
            description: currentWeather.weather[0].description,
            icon: currentWeather.weather[0].icon
          };
        }

        const forecastData = await this.weatherService.getForecast(
          this.hillData.lat,
          this.hillData.lon
        );

        if (forecastData) {
          this.weatherForecast = this.weatherService.processForecastData(forecastData);
        }
      } catch (error) {
        console.error('Error loading weather data:', error);
      }
    }
  }

  getWeatherEmoji(iconCode: string): string {
    const weatherMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return weatherMap[iconCode] || '🌤️';
  }

  openInGoogleMaps(): void {
    if (this.hillData) {
      const url = `https://www.google.com/maps?q=${this.hillData.lat},${this.hillData.lon}`;
      window.open(url, '_blank');
    }
  }

  selectRoute(index: number): void {
    if (!this.hillData) return;
    this.selectedRouteIndex = index;

    // Visualize route on map if GPX exists
    const route = this.hillData.routes[index];
    if (route && route.gps) {
      this.displayRouteOnMap(route.gps);
    } else {
      this.removeRouteFromMap();
      // Center back on hill if no route
      if (this.map && this.hillData) {
        this.map.flyTo([this.hillData.lat, this.hillData.lon], 13);
      }
    }

    // Wait for the next tick to ensure the DOM has updated with the route details section
    setTimeout(() => {
      const element = document.getElementById('map-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
    console.log('Selected route:', this.hillData.routes[index].name);
  }

  deselectRoute(): void {
    this.selectedRouteIndex = null;
    this.removeRouteFromMap();
    if (this.map && this.hillData) {
      this.map.flyTo([this.hillData.lat, this.hillData.lon], 13);
    }
  }

  openImageModal(image: any): void {
    this.selectedImage = image;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }

  getDifficultyIcons(difficulty: string): boolean[] {
    switch (difficulty) {
      case 'Easy': return [true, false, false];
      case 'Medium': return [true, true, false];
      case 'Hard': return [true, true, true];
      default: return [false, false, false];
    }
  }

  getPopularityIcons(popularity: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < popularity);
  }

  downloadRouteGPX(gpsFile: string | undefined): void {
    if (!gpsFile) return;

    const filePath = `assets/gps/${gpsFile}`;
    fetch(filePath)
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = gpsFile;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(err => {
        console.error('Download failed:', err);
        alert('Prenos GPX datoteke ni uspel. Datoteka morda ne obstaja na strežniku.');
      });
  }

  // Webcam logic (similar to CamerasComponent)
  private dynamicSrc: Record<number, string> = {};

  getLiveSrc(cam: any): string {
    return this.dynamicSrc[cam.id] || this.computeLiveSrc(cam);
  }

  private computeLiveSrc(cam: any): string {
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

  openWebcam(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }

  private initMap(): void {
    if (!this.hillData) return;

    // Use a slight timeout to ensure container is rendered
    setTimeout(() => {
      const mapContainer = document.getElementById('hill-page-map');
      if (!mapContainer || !this.hillData) return;

      this.map = L.map('hill-page-map').setView([this.hillData.lat, this.hillData.lon], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      const iconRetinaUrl = 'assets/marker-icon-2x.png';
      const iconUrl = 'assets/marker-icon.png';
      const shadowUrl = 'assets/marker-shadow.png';
      const iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      this.hillMarker = L.marker([this.hillData.lat, this.hillData.lon], { icon: iconDefault })
        .addTo(this.map)
        .bindPopup(`<b>${this.hillData.name}</b><br>${this.hillData.height}m`)
        .openPopup();
    }, 100);
  }

  private displayRouteOnMap(gpsFile: string): void {
    if (!this.map) return;

    this.removeRouteFromMap();

    const filePath = `assets/gps/${gpsFile}`;
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error(`GPX file not found: ${gpsFile}`);
        return response.text();
      })
      .then(gpxText => {
        const parser = new DOMParser();
        const gpxDoc = parser.parseFromString(gpxText, "text/xml");
        const trkpts = gpxDoc.getElementsByTagName('trkpt');
        const latLngs: L.LatLngExpression[] = [];

        for (let i = 0; i < trkpts.length; i++) {
          const lat = parseFloat(trkpts[i].getAttribute('lat') || '0');
          const lon = parseFloat(trkpts[i].getAttribute('lon') || '0');
          latLngs.push([lat, lon]);
        }

        if (latLngs.length > 0) {
          this.routeLayer = L.polyline(latLngs, { color: 'blue', weight: 4 }).addTo(this.map!);
          this.map!.fitBounds(this.routeLayer.getBounds(), { padding: [50, 50] });
        }
      })
      .catch(error => {
        console.error('Error parsing GPX:', error);
        // Optionally notify user
      });
  }

  private removeRouteFromMap(): void {
    if (this.routeLayer && this.map) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = undefined;
    }
  }
}